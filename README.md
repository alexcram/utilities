**Setting up AWS Box**
- Create a medium EC2 instance in the N. Virginia region with an elastic IP address and named the box "**Dev Corporate Box**".
-  Create the keypair pem file named **{pem_file_name}.pem** with 400 permissions.
- Create a security group and open the following ports 22 (ssh), 80 (http), 443 (https), 9763 (wso2 app server api), 9443 (wso2 https).
- SSH in and do `sudo apt-get update`
- Install unzip: `sudo apt-get install unzip`
- Install php5: `sudo apt-get install php5`
- Install libapache2-mod: `sudo apt-get install libapache2-mod-php5`
- Restart Apache Server: `sudo /etc/init.d/apache2 restart`

**Setting Up Apache**
(after ssh-ing into the box)
- `sudo apt-get install apache2`
- Set up code directory: `sudo rm -R /var/www/html/`
- Configure sites-available:
   * Go to directory: `cd /etc/apache2/sites-available/`
  * Edit 000-default.conf file: `sudo vi 000-default.conf`
  * Change ServerAdmin : `ServerAdmin admin@example.com`
  * Change DocumentRoot: `/var/www`
  * Save File: `:wq`
- Reload Apache: `sudo service apache2 reload`
- Restart Apache: `sudo service apache2 restart`

**Setting Up WSO2 on Box**

- `sudo apt-get install default-jre`
- `sudo apt-get install default-jdk`
- Confirm java installation with `java -version`. I get `java version "1.7.0_79"`
- Confirm that Java's bin folder is located here: `ls /usr/lib/jvm/java-1.7.0-openjdk-amd64/jre/`
  * If not, you will need to find the correct path and use it in for the following steps.
- Edit root's bashrc (add all lines to bottom of file): `sudo vi ~/.bashrc`
  * `#WSO2 Java Config`
  * `JAVA_HOME="/usr/lib/jvm/java-1.7.0-openjdk-amd64/jre"`
  * `export JAVA_HOME`
  * `PATH=$JAVA_HOME/jvm:$PATH`
  * `export PATH`
- Reload bashrc file: `source ~/.bashrc`
- Confirm variables were creates: `echo $JAVA_HOME` and `echo $PATH`
- Change to Super User: `sudo su`
- Edit Super User's bashrc: `sudo ~/.bashrc`
  * #WS02 Config
  * `export JAVA_HOME="/usr/lib/jvm/java-1.7.0-openjdk-amd64/jre"`
  * `export PATH=$JAVA_HOME/bin:${PATH}`
- Reload Super User's bashrc file: `source ~/.bashrc`
- Confirm Super User's variables were creates: `echo $JAVA_HOME` and `echo $PATH`
- Exit Super User mode: `exit`
- Copy wso2 product .zip file onto box (I use SCP. Also notw the `~/Desktop` is just where the file was on my local machine, this may vary): `scp -i ~/.ssh/{pem-file-name}.pem ~/Desktop/wso2as-5.2.1.zip ubuntu@{ip address}:/tmp`
- Move wso2 zip file to root's home directory: `sudo mv /tmp/wso2as-5.2.1.zip ~/`
- Unzip in "/usr/lib" Directory: `sudo unzip wso2as-5.2.1.zip -d /usr/lib`
- Create the "appserver" bash script in the "/usr/lib/wso2as-5.2.1/bin" directory (this file is inside the revlink google drive): `sudo vi appserver.sh`
- Make file executable: ` sudo chmod 777 appserver.sh`
- Create symbolic link to "/etc/init.d" directory: `sudo ln -snf /usr/lib/wso2as-5.2.1/bin/appserver.sh /etc/init.d/appserver`
- Add to services: `sudo update-rc.d appserver defaults`

**Running  the Application Server**
- NOTE: Now that the appserver is a default service it will start each time the box is started. Also note that server is expected to be ran from the "root" user. The appserver service switches to that user automatically so you don't need to worry about that.
- Start the Application Server manually: `sudo service appserver start`
- Restart the Application Server manually: `sudo service appserver restart`
- Stop the Application Server manually:` sudo service appserver stop`

**Logging into  the Application Server**
- NOTE: There will be some SSL/HTTPS errors. Until that is configured, please ignore and proceed. Also note you must have the 9443 port on AWS open.
- Management Console: http**s**://{public ip}:9443/carbon/ (this will redirect you to https://{public ip}:9443/carbon/admin/login.jsp)
- Out of the box username and password is: admin/admin

**Setting up WSO2 API**
-After logging in, create an empty jaggery application by uploading a zip file called api.zip.
- Remove the "api" folder created in wso2's file system
  * ` cd /usr/lib/wso2as-5.2.1/repository/deployment/server/jaggeryapps/`
  * `sudo rm -R api`
- Now symbolically link a new api folder:
  * `sudo mkdir ~/repo-folder/api`
  * ` sudo ln -s ~/repo-folder/api/ /usr/lib/wso2as-5.2.1/repository/deployment/server/jaggeryapps/`
- Access api here: http://{public ip}:9763/api

**Setting up GoDaddy**
- Add a new **A record** via the DNS Manager for the domain name in question.
- To add a sub domain: add the sub domain as the "Host" field and the elastic IP address from AWS as the "Points To" field. Click "Save Changes".
 * I set up "dev" to point to our AWS elastic IP address: {ip address}

**Setting up Git**
- Install git: `sudo apt-get install git`
- Change to home directory: `cd ~`
- Create folder that will house this box's repo: `sudo mkdir repo-folder`
- Clone Repo into this new folder (this will ask for your git's username and password): `sudo git clone https://github.com/Account/repo.git repo-folder/`
- Fetch all branches: `sudo git fetch --all`
- Checkout "dev" branch: `sudo git checkout -b dev`
- Symbolically link all applicable folders from repo in home directory to the Apache DocumentRoot directory (showing one example here, repeat for all folders): `sudo ln -s ~/repo/admin/ /var/www/`

**Setting up Mysql and Database Connectors**
- install mysql server: `sudo apt-get install mysql-server`
- copy mysql java connector file to box: `sudo scp -i {pem_file_name}.pem ~/Desktop/mysql-connector-java-5.1.32-bin.jar ubuntu@{ip address}:/tmp`
- Move connector file from "tmp" directory to correct wso2 directory: `sudo mv /tmp/mysql-connector-java-5.1.32-bin.jar /usr/lib/wso2as-5.2.1/repository/components/lib/`

**Install PHPMyAdmin**
- Install phpmyadmin: `sudo apt-get install phpmyadmin`
  * When prompted select "apache" and hit return.
  * When prompted do not set up dbconfig-common as we are going to connect to RDS.
- Open and append "apache.conf": `sudo vi /etc/apache2/apache2.conf`
  * `# Include phpmyadmin config`
  * `Include /etc/phpmyadmin/apache.conf`
- Restart Apache: `sudo service apache2 restart`
- Open and edit the phpmyadmin config file "config.inc.php": `sudo vi /etc/phpmyadmin/config.inc.php`
  * `$cfg['Servers'][$i]['auth_type'] = 'HTTP';`
  * ` $cfg['Servers'][$i]['hide_db'] = '(mysql|information_schema|phpmyadmin)';`
  * ` /* Server parameters */`
  * `$cfg['Servers'][$i]['host'] = '{insert rds endpoint link here}';`
 - Refresh phpmyadmin, enter RDS user and pass and you should be good!
