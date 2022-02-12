import speak from '../utilities/speak';
import * as voice from '../utilities/voiceSettings';
export default async function translate(speech, targetLanguage) {
  let translated;
  let lang = voice.voiceSettings(targetLanguage);
  let taiwanSwap;
  if (targetLanguage == 'zh-HK') {
    lang.target = 'zh-TW';
    taiwanSwap = true;
  }

  await fetch(
    'https://translation.googleapis.com/language/translate/v2?key=AIzaSyCvfxyq6CDaQqsiPhVVuNcj07rPHGxH2dM',
    {
      method: 'POST',
      body: JSON.stringify({
        q: speech[speech.length - 1].inputText,
        // if HK, need zh-TW as traditional target
        target: lang.target,
      }),
    }
  )
    .then((res) => {
      return res.json();
    })
    .then(async (data) => {
      //replace &#39; in italian with proper ' symbol
      translated = data.data.translations[0].translatedText.replace(
        `&#39;`,
        "'"
      );

      // Change back to zh-HK from traditional TW
      if (lang.target == 'zh-TW' && taiwanSwap) {
        lang.target = 'zh-HK';
      }
      speak(translated, lang);
      // return data.data.translations[0].translatedText;
    });
  return translated;
}
