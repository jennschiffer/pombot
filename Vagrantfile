# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = '2'

LINUX = RUBY_PLATFORM =~ /linux/
OSX = RUBY_PLATFORM =~ /darwin/

# In OSX, use NFS for improved performance.
SHARING = OSX ? {nfs: true} : nil

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = 'ubuntu/trusty64'

  # Allow the project directory to be accessible inside the Vagrant box.
  # This should match the Ansible host_vars/vagrant synced_folder value.
  config.vm.synced_folder '.', '/mnt/vagrant', SHARING

  # Ideally, this IP will be unique, so the entry added to /etc/hosts won't
  # conflict with that of another project.
  config.vm.network :private_network, ip: '192.168.33.121'

  # Automatically add an entry to /etc/hosts for this Vagrant box (requires
  # sudo). This should match the Ansible inventory/vagrant ansible_ssh_host
  # value.
  config.hostsupdater.aliases = ['pombot.loc']

  # Giving the VM 1/4 system memory increases performance.
  # https://stefanwrobel.com/how-to-make-vagrant-performance-not-suck
  config.vm.provider 'virtualbox' do |v|
    if OSX
      mem = `sysctl -n hw.memsize`.to_i / 1024
    elsif LINUX
      mem = `awk '/MemTotal/ {print $2}' /proc/meminfo`.to_i
    end
    v.customize ['modifyvm', :id, '--memory', mem / 1024 / 4] if defined?(mem)
  end

  # A specific name looks much better than "default" in ansible output.
  config.vm.define 'vagrant'

  # The Vagrant ansible provisioner is used here for convenience. Instead of
  # the following code, the Vagrant box may be provisioned manually with
  # ansible-playbook (like in production), but adding this code saves the
  # trouble of having to run ansible-playbook manually after "vagrant up".
  config.vm.provision 'ansible' do |ansible|
    ansible.playbook = 'deploy/ansible/init.yml'
  end
end
