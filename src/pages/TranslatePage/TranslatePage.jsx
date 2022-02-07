import SpeechContainer from '../../components/SpeechContainer/SpeechContainer';

export default function TranslatePage({ speech, handleStart, handleStop }) {
  return (
    <>
      HELLO THERE
      <div className='speechContainer'>
        {speech.length > 0 ? (
          speech.map((s, idx) => (
            <SpeechContainer
              speech={s}
              key={idx}
              length={speech.length}
              index={idx}
            />
          ))
        ) : (
          <SpeechContainer speech={'Hold speak to start'} empty={true} />
        )}
      </div>
      {/* <span onClick={initSpeech}>Init</span>&nbsp;&nbsp; */}
      <button onMouseDown={handleStart} onMouseUp={handleStop}>
        SAY
      </button>
    </>
  );
}
