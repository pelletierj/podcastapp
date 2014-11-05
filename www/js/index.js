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
    timerNow: {},
    handle: {},
    progressbar: {},
    
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
        app.refreshPodcasts();
        app.seekbarSetup();
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
                app.refreshPodcasts();
        },true);   
        
        var urlLabel = document.getElementById("urlInput");
            urlLabel.addEventListener("onblur",function(){
                app.hideLabel();
        },true); 
        
        var btnBack = document.getElementsByClassName("back");
        for(var i=0;i<btnBack.length;i++){
            btnBack[i].addEventListener("click",function(){
                app.goMenu();
                //app.refreshPodcasts();
            },true);
        }
        
        var btnPreset = document.getElementsByClassName("presetPods");
        for(var i=0;i<btnPreset.length;i++){
            btnPreset[i].addEventListener("click",function(){
                
                if(podcastList.indexOf(this.getAttribute("data-link")) == -1){
                    podcastList.push(this.getAttribute("data-link"));
                    localStorage["podcastList"] = JSON.stringify(podcastList);
                    alert("Podcast Added");
                }else{
                    alert("That podcast has already been added");   
                }
                
            },true);
        }
            
        var btnPlay = document.getElementById("play");
        btnPlay.addEventListener("click",function(){
            //sets a Counter
            var counter;
            //Starts the podcast
            app.playPodcast();
            //Create the timer to get the Duration
            var timerDur = setInterval(function() {
                //goes increases the counter
                counter = counter + 100;
                //if the counter has reached 2000 and hasn't found the duration
                if (counter > 2000) {
                    //stop it
                    clearInterval(timerDur);
                }
                //get the duration
                var dur = podcast.getDuration();
                //if duration is greater than 0
                if (dur > 0) {
                    //set the Duration by
                    //Getting the hours
                    var durationHours = Math.floor((dur/60)/60);
                    console.log(durationHours + " hours");
                    
                    //if it is less than 1, set the duration to blank.
                    if (durationHours < 1){
                        document.getElementById("durationHours").innerHTML = "";   
                    }
                    //if it is greater than 1, set the hours to the durationHours variable
                    else{
                        document.getElementById("durationHours").innerHTML = durationHours + ":";    
                    }
                    
                    //Gets the Minutes of the duration
                    var durationMinutes = Math.floor(dur/60) % 60;
                    console.log(durationMinutes + " minutes");
                    //if the minutes is less than 1
                    if (durationMinutes < 1){
                        //set the durationMinutes span to 00: to keep it at a 00:00 format
                        document.getElementById("durationMinutes").innerHTML = "00:";   
                    }else if (durationMinutes >= 1 && durationMinutes < 10){
                        //if it is between 1 and 9 add the 0 to keep to the 00:00 format
                        document.getElementById("durationMinutes").innerHTML = "0"+ durationMinutes + ":";   
                    }else{
                        //otherwise just set it to the durationMinutes
                        document.getElementById("durationMinutes").innerHTML = durationMinutes + ":";    
                    }
                    
                    //get the Seconds
                    var durationSeconds = Math.floor(dur % 60);
                    console.log(dur + " seconds");
                    
                    //if duration is less than 10 seconds
                    if (durationSeconds < 10){
                        //add the 0 to keep to the 00:00 format
                        document.getElementById("durationSeconds").innerHTML = "0"+durationSeconds;
                    }else{
                        //otherwise, just set the duration
                        document.getElementById("durationSeconds").innerHTML = durationSeconds;
                    }
                    
                    //Stop trying to get the duration
                    clearInterval(timerDur);
                    
                }
            }, 100); 
            
            timerNow = setInterval(function() {
                podcast.getCurrentPosition(function(position){
                    //if the position is = -1, just straight up set it to 0 for the seekBar's sake
                    if (position == -1){
                        position = 0
                    }
                    
                    //formate the time exactly like they did in the duration
                    var progressHours = Math.floor((position/60)/60);
                    if (progressHours < 0){
                        progressHours = 0;
                    }
                    //console.log(progressHours + " hours");
                    
                    if (progressHours < 1){
                        document.getElementById("progressHours").innerHTML = "";   
                    }else{
                        document.getElementById("progressHours").innerHTML = progressHours + ":";    
                    }
                    
                    var progressMinutes = Math.floor(position/60) % 60;
                    if (progressMinutes < 0){
                        progressMinutes = 0;
                    }
                    //console.log(progressMinutes + " minutes");
                    if (progressMinutes == 0){
                        document.getElementById("progressMinutes").innerHTML = "00:";   
                    }else if (progressMinutes >= 1 && progressMinutes < 10){
                        document.getElementById("progressMinutes").innerHTML = "0"+ progressMinutes + ":";   
                    }
                    else{
                        document.getElementById("progressMinutes").innerHTML = progressMinutes + ":";    
                    }
             
                    
                    var progressSeconds = Math.floor(position % 60);
                    if (progressSeconds < 0){
                        progressSeconds = 0;
                    }
                    if (progressSeconds < 10){
                        document.getElementById("progressSeconds").innerHTML = "0"+progressSeconds;
                    }else{
                        document.getElementById("progressSeconds").innerHTML = progressSeconds;
                    }      
                    
                    //figure out the progress by getting the position and converting it to a percentage to fit the
                    //seekbar code
                    var progress = position / podcast.getDuration();
                    progress = Math.round(progress*100);
                    //console.log(Math.round(progress*100));
                    progressbar.style.width = progress + '%';
                    progressbar.setAttribute('aria-valuenow', progress);
                });
                
                
                
            }, 1000);
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
    
    mediaSetup: function(link){
        if (!link){
            var src = encodeURI("https://dl.dropboxusercontent.com/u/887989/test.mp3");
        }else{ 
            var src = encodeURI(link);
        }
        
        podcast = new Media(src, app.endPodcast); 
        
    },
    
    seekbarSetup: function(){
        handle = document.querySelector('.seekbar input[type="range"]');
        progressbar = document.querySelector('.seekbar div[role="progressbar"]');
        handle.addEventListener('input', function(){
            progressbar.style.width = this.value + '%';
            progressbar.setAttribute('aria-valuenow', this.value);
            var dur = podcast.getDuration();
            var position = dur * (this.value/100);
            podcast.seekTo(position * 1000);
            podcast.getCurrentPosition(function(position){
                    //if the position is = -1, just straight up set it to 0 for the seekBar's sake
                    if (position == -1){
                        position = 0
                    }
                    
                    //formate the time exactly like they did in the duration
                    var progressHours = Math.floor((position/60)/60);
                    console.log(progressHours + " hours");
                    
                    if (progressHours < 1){
                        document.getElementById("progressHours").innerHTML = "";   
                    }else{
                        document.getElementById("progressHours").innerHTML = durationHours + ":";    
                    }
                    
                    var progressMinutes = Math.floor(position/60) % 60;
                    console.log(progressMinutes + " minutes");
                    if (progressMinutes == 0){
                        document.getElementById("progressMinutes").innerHTML = "00:";   
                    }else if (progressMinutes >= 1 && progressMinutes < 10){
                        document.getElementById("progressMinutes").innerHTML = "0"+ progressMinutes + ":";   
                    }
                    else{
                        document.getElementById("progressMinutes").innerHTML = progressMinutes + ":";    
                    }
            
                    
                    var progressSeconds = Math.floor(position % 60);
                    console.log(progressSeconds + " seconds");
                    if (progressSeconds < 10){
                        document.getElementById("progressSeconds").innerHTML = "0"+progressSeconds;
                    }else{
                        document.getElementById("progressSeconds").innerHTML = progressSeconds;
                    }
                    
                    
                    //figure out the progress by getting the position and converting it to a percentage to fit the
                    //seekbar code
                    var progress = position / podcast.getDuration();
                    progress = Math.round(progress*100);
                    //console.log(Math.round(progress*100));
                    progressbar.style.width = progress + '%';
                    progressbar.setAttribute('aria-valuenow', progress);
                });
        });       
    },
    
    goPlayer: function(image){
        var hidden = document.getElementById("menu");
        var shown = document.getElementById("player");
        hidden.className = "hidden";
        shown.className = "";
        
        if(!image){
            image = "../img/appIcon_grey.png";
        }else{
        
            var backgroundImage = document.getElementById("backgroundImage");
            var forgroundImage = document.getElementById("forgroundImage");

            backgroundImage.setAttribute("src", image);
            forgroundImage.setAttribute("src", image);
        }
        
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
        
        if(textValue.value != ""){
            document.getElementById("urlLabel").className = "hidden";
        }else{
            document.getElementById("urlLabel").className = "";
        }
        
        if(app.is_valid_url(textValue.value)){   
            if(podcastList.indexOf(textValue.value) == -1){
                podcastList.push(textValue.value);
                localStorage["podcastList"] = JSON.stringify(podcastList);
                alert("Podcast Added");
            }else{
                alert("That podcast has already been added");   
            }
        }else{
            alert("Invalid url. Please ensure that 'http://' is included at the front of the url and that no spaces are present.");
        }  
        
    },
    
    is_valid_url: function (url){
        var myRegExp =/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
        var urlToValidate = url;
        if (!myRegExp.test(urlToValidate)){
            return false;
        }else{
            return true;
        }
    },
    
    playPodcast: function(){
        podcast.play();     
        
        var hidden = document.getElementById("play");
        var shown = document.getElementById("pause");
        hidden.className = "hidden";
        shown.className = "";
    },
    pausePodcast: function(){
        podcast.pause();
        clearInterval(timerNow);
        
        var hidden = document.getElementById("pause");
        var shown = document.getElementById("play");
        hidden.className = "hidden";
        shown.className = "";
    },
    stopPodcast: function(){
        podcast.stop();
        podcast.release();
        clearInterval(timerNow);
        progressbar.style.width = 0 + '%';
        progressbar.setAttribute('aria-valuenow', 0);
        document.getElementById("progressHours").innerHTML = "";
        document.getElementById("progressMinutes").innerHTML = "00:";
        document.getElementById("progressSeconds").innerHTML = "00";
        
        var hidden = document.getElementById("pause");
        var shown = document.getElementById("play");
        hidden.className = "hidden";
        shown.className = "";
    },
    
    skipPodcast: function(){
        podcast.getCurrentPosition(function(position){
            podcast.seekTo(position*1000 + 30000);
        });
    },
    
    reversePodcast: function(){
        podcast.getCurrentPosition(function(position){
            podcast.seekTo(position*1000 - 10000);
        });
    },
    
    checkConnection: function() {
        var networkState = navigator.network.connection.type;

        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown';
        states[Connection.ETHERNET] = 'Ethernet';
        states[Connection.WIFI]     = 'WiFi';
        states[Connection.CELL_2G]  = '2G';
        states[Connection.CELL_3G]  = '3G';
        states[Connection.CELL_4G]  = '4G';
        states[Connection.NONE]     = 'None';

        return(states[networkState]);
    },
    
    refreshPodcasts: function(){
        
        var storedNames = JSON.parse(localStorage["podcastList"]);
        
        if (storedNames === null) {
        }else{
            podcastList = storedNames;
        }
    
        contentList = document.getElementById("contentList");
        var string = "";
        
        var networkStatus = app.checkConnection();

        if(podcastList.length >= 1 && networkStatus == "WiFi" || podcastList.length >= 1 && networkStatus == "Unknown"){

            for(var j = 0; j < podcastList.length; j++){

                while (contentList.hasChildNodes()) {
                    contentList.removeChild(contentList.firstChild);
                }

                var request = new XMLHttpRequest();
                request.open("GET", podcastList[j], false);
                request.onreadystatechange = function() {
                if (request.readyState == 4) {
                    if (request.status == 200 || request.status == 0) {

                        var podcastXML = request.responseXML;
                        podcastChannel = podcastXML.getElementsByTagName("channel");
                        podcastInfo = podcastXML.getElementsByTagName("item");

                        var podcastTitle = podcastChannel[0].querySelector("title").textContent;


                        string += "<ul>";

                        for(var i = 0; i < 3; i++){
                            var audioSrc = encodeURI(podcastInfo[i].querySelector("link").textContent);
                            var audioSplit = audioSrc.split("/");
                            var linkFolderName = audioSplit.pop();
                            trans = new FileTransfer();
                            
                            string += "<a class='clickedPodcast' data-download='"+podcastInfo[i].querySelector("link").textContent+"' data-image='"+podcastChannel[0].querySelector("image").querySelector("url").textContent+"' data-title = '"+podcastInfo[i].querySelector("title").textContent+"' data-play='"+cordova.file.externalDataDirectory+"/podpro/"+podcastTitle+"/"+linkFolderName+"/audio.mp3' data-playImage='"+cordova.file.externalDataDirectory+"/podpro/"+podcastTitle+"/cover.jpg'> " ;
                            string += "<li>";
                            string += "<img class='remoteImage' src='" +podcastChannel[0].querySelector("image").querySelector("url").textContent +"'/>";
                            string += "<h2>";
                            string += podcastInfo[i].querySelector("title").textContent;
                            string += "</h2>";
                            string += "<p class='duration'>";
                            string += "Duration: " + podcastInfo[i].getElementsByTagNameNS("*", "duration")[0].textContent;
                            string += "</p>";
                            string += "</li>";
                            string += "</a>"

                        
                            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(info){
                                console.log(info);
                                info.getFile("podpro/"+podcastTitle+"/"+linkFolderName+"/audio.mp3",{create:false}, function(){   
                                }, function(){
                                    alert("Downloading podcasts, please wait for a success message before playing.");  
                                                    trans.download(audioSrc,cordova.file.externalDataDirectory+"/podpro/"+podcastTitle+"/"+linkFolderName+"/audio.mp3", app.downloadSuccess, app.downloadError);
                                                    
                                });
                                                
                            }, function(e){
                                console.log(e);
                            });

                        }

                        var imageSrc = encodeURI(podcastChannel[0].querySelector("image").querySelector("url").textContent);
                        trans = new FileTransfer();
                        trans.download(imageSrc,cordova.file.externalDataDirectory+"/podpro/"+podcastTitle+"/cover.jpg", app.downloadSuccess, app.downloadError);

                        string += "</ul>";

                        console.log(string);

                        contentList.innerHTML += string;

                        }
                    }
                }

                request.send();
            }

        }else{
            
            if(networkStatus != "WiFi"){
                
                alert("You are currently not on a wiFi network, your downloads will be completed when you are on a WiFi Network");
            }

            contentList = document.getElementById("contentList");

            contentList.innerHTML = "No Podcasts to load, please add a podcast first"; 
        }
        
        var clickedPodcast = document.getElementsByClassName("clickedPodcast");
        for(var i=0;i<clickedPodcast.length;i++){
            clickedPodcast[i].addEventListener("click",function(){
                
                podcast.stop();
                podcast.release();
                
                app.mediaSetup(this.getAttribute("data-play"));
                app.goPlayer(this.getAttribute("data-playImage"));
            },true);
        }
    },
    
    endPodcast: function(){
        clearInterval(timerNow);   
        var hidden = document.getElementById("pause");
        var shown = document.getElementById("play");
        hidden.className = "hidden";
        shown.className = "";
    },
    
    downloadSuccess: function(){
        alert("Downloads complete");   
        
    },
    
    downloadError: function(e){
        alert("Download Failed");
        console.log(e);
        
        
    }
    
};

app.initialize();