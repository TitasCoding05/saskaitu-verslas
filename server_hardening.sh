#!/bin/bash
set -e

# Server Hardening Script for Ubuntu

# Update and upgrade
sudo apt update && sudo apt upgrade -y

# Install essential security tools
sudo apt install -y ufw fail2ban unattended-upgrades

# Configure Unattended Upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# SSH Hardening
sudo sed -i 's/^PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/^PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# Configure UFW (Uncomplicated Firewall)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable

# Configure Fail2Ban for SSH
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo sed -i 's/bantime  = 10m/bantime  = 1h/' /etc/fail2ban/jail.local
sudo sed -i 's/maxretry = 5/maxretry = 3/' /etc/fail2ban/jail.local
sudo systemctl restart fail2ban

# Create a non-root user for deployment
read -p "Enter new username for deployment: " USERNAME
sudo adduser $USERNAME
sudo usermod -aG sudo $USERNAME

# Setup SSH key authentication for the new user
sudo -u $USERNAME mkdir -p /home/$USERNAME/.ssh
sudo -u $USERNAME chmod 700 /home/$USERNAME/.ssh

echo "Please paste your SSH public key:"
read SSH_PUBLIC_KEY
echo "$SSH_PUBLIC_KEY" | sudo -u $USERNAME tee /home/$USERNAME/.ssh/authorized_keys
sudo -u $USERNAME chmod 600 /home/$USERNAME/.ssh/authorized_keys

# Disable unnecessary services
sudo systemctl disable apache2 > /dev/null 2>&1
sudo systemctl disable sendmail > /dev/null 2>&1

# Additional security recommendations
echo "
# Additional security settings
kernel.randomize_va_space=2
fs.suid_dumpable=0
" | sudo tee -a /etc/sysctl.conf

sudo sysctl -p

echo "Server hardening completed. Please review and adjust settings as needed."
echo "Remember to securely store your SSH private key and disable password authentication."