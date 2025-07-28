from elevenlabs import stream
from elevenlabs.client import ElevenLabs
import os
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
 
load_dotenv()
 
elevenlabs = ElevenLabs(
  api_key=os.getenv("ELEVENLABS_API_KEY"),
)
 
 
elevenlabs = ElevenLabs()
 
audio_stream = elevenlabs.text_to_speech.stream(
    text="""भाई साहब, हो सकता है मिट्टी में कोई कमी हो या पानी में कोई गड़बड़ी हो। कई बार मौसम का असर भी
    पड़ता है, और कुछ बार नकली दवाइयाँ भी असर नहीं करतीं। एक बार कृषि अधिकारी से मिट्टी की जांच करवा लो,
    और किसी भरोसेमंद दुकान से दवाई लेकर देखो।""",
    voice_id="gHu9GtaHOXcSqFTK06ux",
    model_id="eleven_multilingual_v2"
)
 
# option 1: play the streamed audio locally
stream(audio_stream)
