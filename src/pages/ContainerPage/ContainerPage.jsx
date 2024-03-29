import EachSpeech from '../../components/EachSpeech/EachSpeech';
import { useEffect } from 'react';
import './ContainerPage.css';
import microphoneLogo from '../../images/whiteMicrophone.png';
import loadingLogo from '../../images/loading.png';
import swapLogo from '../../images/swap.png';
import stopLogo from '../../images/stop.png';
export default function ContainerPage({
  user,
  nav,
  scrollToBottom,
  speech,
  renderSpeeches,
  setSpeech,
  speechNonLoggedIn,
  setSpeechNonLoggedIn,
  handleStarterConvo,
  handleStart,
  handleStop,
  inputLanguage,
  setInputLanguage,
  outputLanguage,
  setOutputLanguage,
  buttonState,
  cancelOperation,
  languageCodes,
  speechPreFav,
  setSpeechPreFav,
}) {
  function handleLanguageSwap() {
    let tempInputLanguage = inputLanguage;
    setInputLanguage(outputLanguage);
    setOutputLanguage(tempInputLanguage);
  }

  function handleSetInputLanguage(input) {
    setInputLanguage(input);
  }

  useEffect(function () {
    renderSpeeches();
    // Populate the page with starter convo for un-loggedin users
    if (!user && (!speech[0] || !speech[0].sample) && speech.length == 0) {
      handleStarterConvo();
    } else if (user) {
      scrollToBottom();
    }
  }, []);

  return (
    <>
      <div className='speechContainer'>
        <span className='selectorContainer'>
          <select
            // Disables input speech when speech is being recorded
            disabled={
              speech[speech.length - 1] && speech[speech.length - 1].freshSpeech
                ? true
                : ''
            }
            className='languageSelect'
            onChange={(evt) => handleSetInputLanguage(evt.target.value)}
            value={inputLanguage}
          >
            {languageCodes.map((option, idx) => (
              <option key={idx} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <img
            src={swapLogo}
            className='swapArrow'
            onClick={handleLanguageSwap}
          />

          <select
            className='languageSelect'
            onChange={(evt) => setOutputLanguage(evt.target.value)}
            value={outputLanguage}
          >
            {languageCodes.map((option, idx) => (
              <option key={idx} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </span>
        <div className='dialogueFadeBottom'>
          <div
            className={
              speech.length > 3 ? 'dialogue dialogueFadeTop' : 'dialogue'
            }
            id='dialogue'
          >
            {speech[0] ? (
              speech.map((s, idx) => (
                <EachSpeech
                  key={idx}
                  user={user}
                  index={idx}
                  eachSpeech={s}
                  speech={speech}
                  setSpeech={setSpeech}
                  speechNonLoggedIn={speechNonLoggedIn}
                  setSpeechNonLoggedIn={setSpeechNonLoggedIn}
                  languageCodes={languageCodes}
                  outputLanguage={outputLanguage}
                  speechPreFav={speechPreFav}
                  setSpeechPreFav={setSpeechPreFav}
                  cancelOperation={cancelOperation}
                />
              ))
            ) : (
              <div className='emptyPrompt'>
                {nav == 'fav'
                  ? 'Favourites List Empty'
                  : 'Press button to start'}
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className='speakButton'>
          {buttonState ? (
            buttonState == 'loading' ? (
              <img src={loadingLogo} className='loading' />
            ) : (
              <img
                src={microphoneLogo}
                className={
                  speech[0] ? 'microphone' : 'microphone  microphoneEmpty'
                }
                onClick={handleStart}
              />
            )
          ) : (
            <img src={stopLogo} className='recording' onClick={handleStop} />
          )}
        </div>
      </div>
    </>
  );
}
