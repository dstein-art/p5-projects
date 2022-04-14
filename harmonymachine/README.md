# Magic Harmony Machine

To run the harmony machine you need to have a Midi Driver at “IAC Driver Bus 1” and run Ableton with three channels. Channel 1 is the lead instrument, Channel 2 is the Accompaniment Instrument and Channel 10 is a drum kit. I coded the drum machine to specifically use Ableton’s 808 Core Kit although other kits could probably be used with a little modification.

## The Magic Harmony Machine is made up of several parts. 

The Rhythm Grid allows you to start a beat using a selection of 8 different instruments. By clicking on each cell multiple times, you can toggle through two different instruments on each row. The first row (from the top) is a Kick/Tom, second row is a Snare/Clap, third row is a Low Conga/Cowbell and fourth row is an Open/Closed High Hat. You can also select the BPM above the grid.

The accompaniment is a chord with a root note equivalent to the note that was played on the midi keyboard controller at the time of a change. The chords are played such that they fit within a single octave of the scale that is selected. So chord inversions frequently occur to keep the chord within the octave. The key and octave are selected using the drop down inputs. The chord is always played back in the octave that is selected in the drop down, the octave that the note was played on the midi controller is ignored and only the position in the scale is used as a trigger for the accompaniment.

An accompaniment can be created by typing the number of beats before each accompaniment change. So a “4” would change the accompaniment every 4 beats. A “12 4” would play 12 beats as one chord and then 4 beats as the next chord.

The keyboard is just a display of the notes being played on a Midi controller as well as the accompaniment chord.