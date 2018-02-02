# find-lf-unifi-source
This software turns a unifi controller into a source of signal levels for a find-lf-server

## Setup
Copy config.ini.sample to config.ini and edit the settings in the file to meet your setup

### config.json settings
### unifi
These settings relate to your unifi controller

#### username
The Username for your controller

#### password
The password for your controller

#### addr
The hostname/ip address for your controller

#### port
The ssl port for your controller

#### site
The short site "name" which is visible in the URL when managing the site in the UniFi Controller:

`https://<controller IP address or FQDN>:8443/manage/site/a8fzkspd/dashboard`

In this case, a8fzkspd is the value required for site

### findlf
These settings relate to your find-lf server

#### url
url to the lf server. If you don't mind using the public server then the default is fine

#### group
a unique identifier for your network on the find-lf/find server

### other
Settings that change the behavior of the source go here

#### interval
How often to poll the unifi controller and send them to the find-lf server


You need a working find-lf server to use this. The public server at https://lf.internalpositioning.com works fine to get up and running though.
You can then access the data at that servers public find counterpart at https://ml.internalpositioning.com .


