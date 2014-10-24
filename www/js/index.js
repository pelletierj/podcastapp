/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var podcastList = [];

var app = {
    
    //declares podcast variable
    podcast: {},
    
    //podcast list array
    //podcastList: [],
    
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.buttonSetup();
        app.receivedEvent('deviceready');
        app.mediaSetup();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },
    
    buttonSetup: function() {
        var btnPlayer = document.getElementById("playerButton");
        btnPlayer.addEventListener("click",function(){
            app.goPlayer();
            
        },true);
        
        var btnAdd = document.getElementById("addButton");
        btnAdd.addEventListener("click",function(){
            app.goAdd();
            
        },true);
        
        var btnAddToList = document.getElementById("addPodcastButton");
        btnAddToList.addEventListener("click",function(){
            app.addToList();
            
        },true);
        
        var btnRefresh = document.getElementById("refresh");
        
            btnRefresh.addEventListener("click",function(){
                //alert("Refresh");
                
                if(podcastList.length >= 1){
                
                for(var j = 0; j < podcastList.length; j++){
                
                
                    console.log('calling xhr');
                    var request = new XMLHttpRequest();
                    request.open("GET", podcastList[j], true);
                    request.onreadystatechange = function() {
                    if (request.readyState == 4) {
                        if (request.status == 200 || request.status == 0) {

                            //alert("Success");

                            //console.log(request.responseText);

                            if (window.DOMParser)
                              {
                                parser=new DOMParser();
                                xmlDoc=parser.parseFromString(request.responseText,"text/xml");
                                //alert("Parsed");
                              }
                            else // Internet Explorer
                              {
                                xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                                xmlDoc.async=false;
                                xmlDoc.loadXML(txt);
                              }

                            contentList = document.getElementById("contentList");

                            contentList.innerHTML = "";

                            var string = "<ul>";

                            for(var i = 0; i < 3; i++){
                                string += "<li>";
                                //string += "<img src=" + xmlDoc..getElementsByTagName("url")[0].childNodes[0].nodeValue + "/>";
                                string += "<h2>";
                                string += xmlDoc.getElementsByTagName("title")[i].childNodes[0].nodeValue;
                                string += "</h2>";
                                string += "</li>";

                                contentList.innerHTML += string;

                                string = "";
                            }

                            //console.log(xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue);

                                }
                            }

                        }
                
                    }
                    
                }else{
                    
                    contentList = document.getElementById("contentList");

                    contentList.innerHTML = "No Podcasts to load, please add a podcast first"; 
                }
                request.send();
            },true); 
        
        
        
        var btnBack = document.getElementsByClassName("back");
        for(var i=0;i<btnBack.length;i++){
            btnBack[i].addEventListener("click",function(){
                app.goMenu();
            },true);
        }
            
        var btnPlay = document.getElementById("play");
        btnPlay.addEventListener("click",function(){
            app.playPodcast();
        },true);
        
        var btnPause = document.getElementById("pause");
        btnPause.addEventListener("click",function(){
            app.pausePodcast();
        },true);
        
        var btnStop = document.getElementById("stop");
        btnStop.addEventListener("click",function(){
            app.stopPodcast();
        },true);
        
        var btnSkip = document.getElementById("skip");
        btnSkip.addEventListener("click",function(){
            app.skipPodcast();
        },true);
        
        var btnReverse = document.getElementById("reverse");
        btnReverse.addEventListener("click",function(){
            app.reversePodcast();
        },true);
    
    },
    
    
    mediaSetup: function(){
      var src = encodeURI("https://dl.dropboxusercontent.com/u/887989/test.mp3");
      podcast = new Media(src);  
    },
    
    goPlayer: function(){
        var hidden = document.getElementById("menu");
        var shown = document.getElementById("player");
        hidden.className = "hidden";
        shown.className = "";
    },
    goAdd: function(){
        var hidden = document.getElementById("menu");
        var shown = document.getElementById("addPage");
        hidden.className = "hidden";
        shown.className = "";
    },
    goMenu: function(){
        var hidden = document.getElementById("player");
        var hidden2 = document.getElementById("addPage");
        var shown = document.getElementById("menu");
        hidden.className = "hidden";
        hidden2.className = "hidden";
        shown.className = "";
    },
    
    addToList: function(){
        
        textValue = document.getElementById("addPodcastText");
        
        podcastList.push(textValue.value);
        
        alert("Podcast Added");
    },
    
    playPodcast: function(){
        console.log("YOU CLICKED PLAY");
        podcast.play();
        
    },
    pausePodcast: function(){
        console.log("YOU CLICKED PAUSE!");
        podcast.pause();
    },
    stopPodcast: function(){
        console.log("YOU CLICKED STOP!");
        podcast.stop();
        podcast.release();
    },
    
    skipPodcast: function(){
        console.log("YOU CLICKED SKIP");
        podcast.getCurrentPosition(function(position){
            //alert(position + " seconds.");
            //alert("From : " + position * 1000 + " miliseconds.");
            podcast.seekTo(position*1000 + 30000);
            //alert("To : " + position * 1000 + " miliseconds.");
        });
    },
    
    reversePodcast: function(){
        console.log("YOU CLICKED REVERSE");
        podcast.getCurrentPosition(function(position){
            //alert(position + " seconds.");
            //alert("From : " + position * 1000 + " miliseconds.");
            podcast.seekTo(position*1000 - 10000);
            //alert("To : " + position * 1000 + " miliseconds.");
        });
    }
};

function qs(s) { return document.querySelector(s) }

    var handle = qs('.seekbar input[type="range"]');
    var progressbar = qs('.seekbar div[role="progressbar"]');

    handle.addEventListener('input', function(){
      progressbar.style.width = this.value + '%';
      progressbar.setAttribute('aria-valuenow', this.value);
    });

app.initialize();