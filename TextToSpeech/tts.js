var g_speaking = false;

var play_html5_audio = false;
if (html5_audio()) play_html5_audio = true;
function html5_audio() {
  var a = document.createElement('audio');
  return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
}

function speak(txt, lang) {  
  // Don't interrupt yourself.
//  if (g_speaking) return;
  
  // Take the next chunk off the top, a max of 100 characters.
  var truncated = txt.length >= 100;
  var thisChunk = txt.substr(0, 100).trim();
  if (thisChunk == '') {
    console.log("nothing left to say");
    g_speaking = false;
    return;
  }

  // Remove text after the last space.
  if (truncated)  {
    thisChunk = thisChunk.replace(/ [^ ]*$/, '');
  }

  // Remove from buffer.  This function is called recursively through
  // a callback, and the txt parameter shrinks each time.
  txt = txt.replace(thisChunk, '');

  textToSpeech(thisChunk, txt, lang);
}

function textToSpeech(thisChunk, txt, lang) {
  g_speaking = true;
  
  // Example:
  // http://translate.google.com/translate_tts?ie=UTF-8&q=what%20can%201%20say%3F&tl=en&total=1&idx=0&textlen=15
  

  var textlen = thisChunk.length;
  play_sound("http://translate.google.com/translate_tts?ie=UTF-8"
    + "&q=" 
    + encodeURIComponent(thisChunk) 
    + "&tl=" 
    + lang
    + "&total=1&idx=0"    
    + "&textlen=" + textlen
    , txt, lang);
}

function play_sound(url, txt, lang) {

  function onEnded() {
    // Recursion.  Check to see if there is more to say.
    speak(txt, lang);
  }

  if (play_html5_audio) {
    var snd = new Audio(url);
    console.log(url);
    snd.load();
    snd.play();
    snd.addEventListener("ended", onEnded);
    snd.addEventListener("error", onEnded);
  } else {
    $("#sound").remove();
    var sound = $("<embed id='sound' type='audio/mpeg' />");
    sound.attr('src', url);
    sound.attr('loop', false);
    sound.attr('hidden', true);
    sound.attr('autostart', true);
    
    sound[0].onended = onEnded;    
    
//    sound.attr('onended', onEnded);
//    sound.addEventListener("onended", onEnded);    

    $('body').append(sound);
  }
}