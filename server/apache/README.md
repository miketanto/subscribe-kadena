For CentOS httpd:

SELinux on RHEL/CentOS by default ships so that httpd processes cannot initiate outbound connections, which is just what mod_proxy attempts to do.

Thus, to make proxy work, we need to run this:
```bash
sudo /usr/sbin/setsebool -P httpd_can_network_connect 1
```

Source: https://stackoverflow.com/a/28201422
