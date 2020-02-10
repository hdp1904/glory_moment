var counter = 0;
function changeBG(){
    var imgs = [
        "url(https://i.imgur.com/WIdaEZv.jpg)",
        "url(https://i.imgur.com/WcFVNhz.jpg)",
        "url(https://i.imgur.com/lDQMIDZ.jpg)",
        "url(https://i.imgur.com/nBkCKvX.png)",
        "url(https://i.imgur.com/JzM3zA2.jpg)",
        "url(https://i.imgur.com/DXblbGV.png)",
        "url(https://i.imgur.com/w1wns5f.jpg)",
        "url(https://i.imgur.com/5vovkQy.jpg)"
      ]
    
    if(counter === imgs.length) counter = 0;
    $("body").css("background-image", imgs[counter]);
//
    counter++;
}
  
  setInterval(changeBG, 4000);


