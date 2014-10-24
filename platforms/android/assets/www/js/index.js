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
var app = {
    
    //declares podcast variable
    podcast: {},
    
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
        var btnSearch = document.getElementById("search");
        btnSearch.addEventListener("click",function(){
            app.goPlayer();
            
        },true);
        
        var btnRefresh = document.getElementById("refresh");
        
            btnRefresh.addEventListener("click",function(){
                //alert("Refresh");
                console.log('calling xhr');
                var request = new XMLHttpRequest();
                request.open("GET", "http://feeds.feedburner.com/WelcomeToNightVale", true);
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
                
                request.send();
            },true); 
        
        
        
        var btnBack = document.getElementById("back");
        btnBack.addEventListener("click",function(){
            app.goMenu();
        },true);
        
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
    goMenu: function(){
        var hidden = document.getElementById("player");
        var shown = document.getElementById("menu");
        hidden.className = "hidden";
        shown.className = "";
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
        
    }
};

app.initialize();