export default class Audio
{
    constructor(game)
    {
        this.g = game;

        //This function is mapped to user gesture to be able to initialize audio when the player passes
        //through the title screen
        this.t = function(type, e)
        {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.n("sine", 1, 1, 1);

            let game = this.g;
            game.e[0] = true;
            //game.e[1] = true;
            game.c.r();

            delete game.i.e.m.a;
            game.uf("touchend", this.t);
        }.bind(this);
        game.i.e.m.a = this.t;
        game.f("touchend", this.t);

        //Sound and music volume
        this.v = (game.v.d.vol === 0 ? 0 : 1);

        //G Major Scale frequencies (in Hz)
        this.f = [
            //G1 to G2
            [49, 55, 61.74, 65.41, 73.42, 82.41, 87.31, 98],
            //G2 to G3
            [98, 110, 123.5, 130.8, 146.8, 164.8, 185, 196],
            //G3 to G4
            [196, 220, 246.9, 261.6, 293.7, 329.6, 349.2, 392],
            //G4 to G5
            [392, 440, 493.9, 523.3, 587.3, 659.3, 740, 784]
        ];

        //Instruments that could be played
        this.i = [
            "triangle", //Bass,
            "square",    //Guitar1
            "sawtooth"    //Guitar2
        ];

        /**
            List of background music songs

            The way it works is that it reads each digits and associates it with a parameter:
            
                From left to right:
                - 1st: (Optional) How many times the note should be repeated
                - 2nd: Instrument to use (triangle, square or sawtooth)
                - 3rd: Scale of frequency to use
                - 4th: Note on the scale
                - 5th: Duration of the note (this number is multiplied by 0.25 seconds)
            
            If the number is negative then it is a silence and the duration is the absolute value
        */
        this.b = [
            //Exploration
            [
                [2012, 2032, 2042, 2058, 2011, 2011, 2032, 2042, 2008, 2012, 2032, 2042, 2058, 2041, 2061, 2041, 2051, 2031, 2021, 2008],
                [1124,       1132, 1148, 1124,       1112,       1108, 1124,       1132, 1148, 1122,       1112,       1122,       1108],
                [-8,-2,            3374, -8,-2,                  3344, -8,-2,            3374, -8,-2,                              3334]
            ],
            //Encounter
            [
                [22111, 2241, 22111, 2251, 22111, 2261, 22111, 2271, 22111, 2261, 22111, 2251, 22111, 2242,  2262,  2242,  2232],
                [1113,  1141, 1113,  1151, 1113,  1161, 1113,  1171, 1113,  1161, 1113,  1151, 1115,         1162,  1142,  1132]
            ],
            //Shop
            [
                [3214, 3251, 3262, 3252, 3214, 3251, 3261, 3261, 3252, 3204, 3241, 3252, 3242, 3204, 3241, 3251, 3251, 3242],
                [1119],
                [-2, 1252, 1231, 1242, 1252, -2, 1252, 1231, 1241, 1241, 1252, -2, 1232, 1221, 1232, 1242, -2, 1232, 1221, 1231, 1231, 1242]
            ]
        ];
        this.c = -1;
    }

    /*
        -- FUNCTION NAME: timeout
        -- DESCRIPTION: Alias for the setTimeout function
    */
    k(fct, t)
    {
        return setTimeout(fct, t);
    }

    /*
        -- FUNCTION NAME: sound
        -- DESCRIPTION: Mutes or unmutes the audio in the game
    */
    s()
    {
        let game = this.g;
        let save = game.v;
        let vol = (!this.v ? 1 : 0);;
        this.v = vol;
        save.d.vol = vol;
        save.s();
        game.c.r();
    }

    /*
        -- FUNCTION NAME: playNote
        -- DESCRIPTION: Plays a note with the help of an oscillator
    */
    n(instrument, note, duration = 1, init = 0)
    {
        let context = this.context;

        if (context && this.v)
        {
            var oscillator = context.createOscillator();
            var gain = (context.createGainNode ? context.createGainNode() : context.createGain());

            oscillator.connect(gain);
            gain.connect(context.destination);
            oscillator.frequency.value = note;
            oscillator.type = instrument;
            oscillator.start(0);
            gain.gain.setValueAtTime(0.1 * this.v * (init ? 0.001 : 1), context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
            oscillator.stop(context.currentTime + duration);
            //this.t(function(){ oscillator.stop(); }.bind(this), duration * 1000);
        }
    }

    /*
        -- FUNCTION NAME: playBgm
        -- DESCRIPTION: Plays a background music from the list
    */
    p(songId)
    {
        if (this.c != songId)
        {
            this.q();
            this.z = {};
            this.c = songId;

            for (let layerId in this.b[songId])
            {
                this.z[layerId] = {};
                this.e(songId, layerId, 0, 0);
            }
        }
    }

    /*
        -- FUNCTION NAME: stopBgm
        -- DESCRIPTION: Stops the currently played background music
    */
    q()
    {
        for (let key in this.z)
        {
            clearTimeout(this.z[key]);
        }
        this.c = -1;
    }

    /*
        -- FUNCTION NAME: playNextNote
        -- DESCRIPTION: Plays the next note in line for the current background music song
    */
    e(songId, layerId, noteId, repeatId)
    {
        let layer = this.b[songId][layerId];
        if (noteId >= layer.length)
        {
            noteId = 0;
        }

        let data = layer[noteId]+"";
        let duration = data.substr(-1)*0.25;
        noteId++;
        if (data > 0)
        {
            let instrument = 0;
            let freq = 1;
            let note = 2;
            if (data.length > 4 && repeatId < data.substr(0,1))
            {
                noteId--;
                repeatId++;
                instrument = 1;
                freq = 2;
                note = 3;
            }
            else
            {
                repeatId = 0;
            }

            this.n(
                this.i[data.substr(instrument, 1)-1],
                this.f[data.substr(freq, 1)][data.substr(note, 1)]
            );
        }

        this.z[layerId] = this.k(this.e.bind(this, songId, layerId, noteId, repeatId), duration*1000);
    }

    /**
        -- FUNCTION NAME: playSfx
        -- DESCRIPTION: Plays a sound effect

        SFX IDs:
            - 0 : Enemy becomes aggro
            - 1 : Bonk into a wall
            - 2 : Enemy hit the player
            - 3 : Pick up light
            - 4 : Pick up coin
            - 5 : Pick up gem
            - 6 : Reachin stairs
    */
    x(sfxId)
    {
        let instruments = this.i;
        let frequencies = this.f;

        let n = this.n.bind(this);

        let delay = function(wait, instrument, note)
        {
            this.k(n.bind(this, instrument, note), wait);
        }
        .bind(this);

        if (sfxId < 1)
        {
            for (let i = 0; i < 4; i++)
            {
                delay(90*i, instruments[2], frequencies[3-(i >2 ? 2 : (i > 0 ? 1 : 0))][5*(i%2)]);
            }
        }
        else if (sfxId < 2)
        {
            n(instruments[2], frequencies[0][5]);
        }
        else if (sfxId < 3)
        {
            for (let i = 0; i < 3; i++)
            {
                delay(75 * i +75*(i-1*1.5)*i, instruments[2], frequencies[1][(i < 2 ? 1 : 0)]);
            }
        }
        else if (sfxId < 4)
        {
            for (let i = 0; i < 3; i++)
            {
                delay(i*90, instruments[2], frequencies[1][3+i*2]);
            }
        }
        else if (sfxId < 5)
        {
            n(instruments[1], frequencies[3][7]);
        }
        else if (sfxId < 6)
        {
            for (let i = 0; i < 4; i++)
            {
                delay(i*90, instruments[1], frequencies[2][4 - (i>2 ? -3 : i%2)]);
            }
        }
        else if (sfxId < 7)
        {
            for (let i = 0; i < 6; i++)
            {
                delay(i*130, instruments[1], frequencies[2][(i > 2 ? Math.min(2 + ((i-3)*3 + (i-3)%2*(i-3)),7) : (7-i%2*2))]);
            }
        }
    }
}