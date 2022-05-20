'use strict'

var WebSocketClient = require('websocket').client
var answers = require('./content/answers.json');
var entities = require('./content/entities.json');
var repeated = require('./content/repeated.json');
var wrongInput = require('./content/wrongUserInput.json');
let oldumsg = "";
let oldInhalt = "";
let umsgRepeated = 0;

/**
 * bot ist ein einfacher Websocket Chat Client
 */

class bot {

  /**
   * Konstruktor baut den client auf. Er erstellt einen Websocket und verbindet sich zum Server
   * Bitte beachten Sie, dass die Server IP hardcodiert ist. Sie müssen sie umsetzten
   */
  constructor () {
    
 
      

    /** Die Websocketverbindung
      */
    this.client = new WebSocketClient()
    /**
     * Wenn der Websocket verbunden ist, dann setzten wir ihn auf true
     */
    this.connected = false

    /**
     * Wenn die Verbindung nicht zustande kommt, dann läuft der Aufruf hier hinein
     */
    this.client.on('connectFailed', function (error) {
      console.log('Connect Error: ' + error.toString())
    })

    /** 
     * Wenn der Client sich mit dem Server verbindet sind wir hier 
    */
    this.client.on('connect', function (connection) {
      this.con = connection
      console.log('WebSocket Client Connected')
      connection.on('error', function (error) {
        console.log('Connection Error: ' + error.toString())
      })

      /** 
       * Es kann immer sein, dass sich der Client disconnected 
       * (typischer Weise, wenn der Server nicht mehr da ist)
      */
      connection.on('close', function () {
        console.log('echo-protocol Connection Closed')
      })

      /** 
       *    Hier ist der Kern, wenn immmer eine Nachricht empfangen wird, kommt hier die 
       *    Nachricht an. 
      */
      connection.on('message', function (message) {
        if (message.type === 'utf8') {
          var data = JSON.parse(message.utf8Data)
          console.log('Received: ' + data.msg + ' ' + data.name)
        }
      })

      /** 
       * Hier senden wir unsere Kennung damit der Server uns erkennt.
       * Wir formatieren die Kennung als JSON
      */
      function joinGesp () {
        if (connection.connected) {
          connection.sendUTF('{"type": "join", "name":"MegaBot"}')
        }
      }
      joinGesp()
    })
  }

  /**
   * Methode um sich mit dem Server zu verbinden. Achtung wir nutzen localhost
   * 
   */
  connect () {
    this.client.connect('ws://localhost:8181/', 'chat')
    this.connected = true
  }

  /** 
   * Hier muss ihre Verarbeitungslogik integriert werden.
   * Diese Funktion wird automatisch im Server aufgerufen, wenn etwas ankommt, das wir 
   * nicht geschrieben haben
   * @param intent auf die der bot reagieren soll
   * @param entity wird übergeben wenn LUIS eine entity erkannt hat
  */
   
  post (intent,entity,umsg) {
    
    let intents = answers.answers;
    let umsg1 = umsg;
    let classarray = entities.classes;
    let answersToWrongInput = wrongInput.answers;
    let checkclass;
    var name = 'MegaBot'
    var inhalt = ''
    let answer = "";
    

    /***
     * checkt ob der User sich ständig wiederholt und gibt entsprechende Antworten
     */
    if(oldumsg === umsg){
      if(umsgRepeated == 3){
        umsgRepeated = 0;
      }
      answer = repeated.answers[umsgRepeated].option;
      umsgRepeated += 1;
    } else {
    umsgRepeated = 0;
    oldumsg = umsg;
    /**
     * sucht ein match für den TopIntent der von LUIS erkannt wurde
     */
    for ( let j = 0 ; j<(intents).length ;j++) {
      inhalt = intents[j].intent;
      if (intent.includes(inhalt)) {
        answer = intents[j].answer;
        break;
      } else {
        answer = "Lass uns das nochmal versuchen :)"
      }
    }

    /**
     * Wenn es um Führerscheinklassen geht, wird die bestimmte Klasse als entity gesucht.
     */
    if(inhalt == "Führerscheinklassen"|| oldInhalt == "Klassenübersicht"){
      for ( let j = 0 ; j<(classarray).length;j++) {
        checkclass = entities.classes[j].class;
        entity = entity.toLowerCase();
        if (entity === checkclass) {
          answer = entities.classes[j].answer;
          answer += " Für Aktuelle Preise rufen sie uns an unter 0171 6053279";
          break;
        } 
      }

    }
  
   
      /**
     * 
     * wenn ein input nicht erkannt werden kann, wir eine zufällige antwort gewählt, um den nutzer zu informieren dass er nicht verstanden wurde
     */
    if(inhalt == "None"){
      let rand = Math.floor(Math.random()*(((answersToWrongInput).length-1)-0+1)+0);
          answer = answersToWrongInput[rand].option; 
    }
    oldInhalt = inhalt;
  }
    /*
     * Verarbeitung
    */
    var msg = '{"type": "msg", "name": "' + name + '", "msg":"' + answer + '"}'
    console.log('Send: ' + msg)
    this.client.con.sendUTF(msg)
  }

}

module.exports = bot
