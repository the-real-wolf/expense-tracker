Damit die Anwendung gestartet werden kann muss Angular, Ionic und Node.js global auf dem Zielrechner installiert werden.

Installationsleitfaden:

1) Node.js & NPM-Package-Manager

   Unter folgendem Link kann die aktuellste Version von Node.js installiert werden. 
   Im Zuge der Installation wird automatisch die aktuellste Version des NPM-Package-Managers installiert.

      https://nodejs.org/en/download/


3) Angular 

   Sobald Node.js und der NPM-Package-Manager erfolgreich installiert wurden, muss Angular installiert werden. 
   Dazu die Eingabeaufforderung öffnen und folgenden Befehl ausführen:

      npm install -g @angular/cli

   Nachdem die Installation abgeschlossen wurde kann die installierte Angular Version inklusive Node.js und NPM-Package-Manager Version mit folgendem Befehl abgefragt werden

      ng v

   Im Optimalfall liegen die folgenden Versionen vor
   Angular:    13.0.3
   Node.js:    16.13.0
   NPM-Package-Manager: 8.1.4


4) Ionic

   Zum Schluss wird zusätzlich Ionic für Angular benötigt, damit die WebApp ausgeführt werden kann.
   Hierzu kann folgender Befehl in der Eingabeaufforderung ausgeführt werden

      npm install -g @ionic/cli


5) Batch-Datei im Rootfolder "02_InstallPackages" ausführen

   Hier werden alle benötigten node_modules für die Anwendung lokal installiert, falls noch nicht vorhanden


6) Batch-Datei im Rootfolder "01_StartLiveServer" ausführen

   Nachdem das Skript läuft wird die Anwendung im Browser unter localhost:8100 geöffnet

