import Audio from "../audio/Audio.js";
import Canvas from "../drawing/Canvas.js";
import Enemy from "../character/Enemy.js";
import Hero from "../character/Hero.js";
import Icon from "../ui/Icon.js";
import Input from "../input/Input.js";
import Maze from "../dungeon/Maze.js";
import Prop from "../prop/Prop.js";
import Save from "../save/Save.js";
import UIHud from "../ui/UIHud.js"; 

export default class Game
{
    constructor()
    {
        let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Mobile|Opera Mini/i.test(navigator.userAgent);

        //Unique ID counter to increment on each spawn
        this.d = 1;

        //List of objects spawned in game
        this.w = {1:[], 2:[]};

        //Amount of coins the player possesses
        this.z = 0;

        //List of gems and if the player has them in its inventory
        this.g = {1:0, 2:0, 3:0, 4:0};

        //Prices for items sold in the shop. If 0, then the item is sold out
        this.p = {1:15, 2:15, 3:10};

        //Time of the last frame in the game loop. Used to calculate delta time
        this.y = (new Date()).getTime();

        //List of states of the game. Index 0 is "started" and index 1 is "cinematic" and index 1 is "canRestart"
        this.e = [false, false, false];

        //Current gameplay time (in seconds) for this session
        this.t = 0;

        //If the player possesses the bomb upgrade or not
        this.b = 0;

        //Current level of the game. Starts at 0 because the newLevel function automatically increases it to 1 on start
        this.l = 0;

        //If the game is currently paused or not
        this.pa = false;

        //This is the game over value.
        /**
            0 : The game is still going on
            1 : The player failed because it ran out of light
            2 : The player failed because it ran out of HP

            9 : The player completed the four floors and won the game
        */
        this.gg = 0;

        //Save manager
        //--------------------------------------
        this.v = new Save();

        //Input manager
        //--------------------------------------
        let input = new Input(this);
        this.i = input;

        //Canvas
        //--------------------------------------
        let canvas = new Canvas(this, isMobile);
        this.c = canvas;

        //Audio manager
        //--------------------------------------
        this.a = new Audio(this);

        //Dungeon Maze
        //--------------------------------------
        let maze = new Maze(this, canvas, isMobile);
        this.m = maze;
        this.c.maze = maze;

        //Icon library
        //--------------------------------------
        let icon = new Icon(canvas);
        this.n = icon;

        //UI Hud
        //--------------------------------------
        let ui = new UIHud(this, canvas, isMobile);
        this.u = ui;

        canvas.a["m"] = maze;
        canvas.a["u"] = ui;

        //Hero
        //--------------------------------------
        let hero = new Hero([], canvas, maze);
        this.h = hero;

        //List of objects to update in the update loop
        this.tu = {"i": input};

        this.nl();

        this.q(); 
    }

    /*
        -- FUNCTION NAME: map
        -- DESCRIPTION: Alias for mapping events to the window object
    */
    f(id, fct)
    {
        window.addEventListener(id, fct);
    }

    /*
        -- FUNCTION NAME: unmap
        -- DESCRIPTION: Alias for unmapping events from the window object
    */
    uf(id, fct)
    {
        window.removeEventListener(id, fct);
    }

    /*
        -- FUNCTION NAME: frame
        -- DESCRIPTION: Alias for mapping an action to the requestAnimationFrame method
    */
    j(fct)
    {
        window.requestAnimationFrame(fct);
    }

    /*
        -- FUNCTION NAME: timeout
        -- DESCRIPTION: Alias for setting a setTimeout function
    */
    k(fct, t)
    {
        return setTimeout(fct, t);
    }

    /**
        -- FUNCTION NAME: spawn
        -- DESCRIPTION: Spawns an object in the level

        Spawn types:
            - 1 : Prop
            - 2 : Enemy
    */
    s(type, id, cell)
    {
        let content = null;
        let uId = this.d;

        if (type > 1)
        {
            content = new Enemy(id, uId, cell, this.c, this.m);
        }
        else
        {
            content = new Prop(id, uId, cell, this.n, this);
        }
        this.w[type].push(content);
        this.d++;

        return content;
    }

    /*
        -- FUNCTION NAME: despawn
        -- DESCRIPTION: Removes an object from the game
    */
    ds(uId)
    {
        let spawns = this.w;
        for(let type in spawns)
        {
            for (let i = 0; i < spawns[type].length; i++)
            {
                if (spawns[type][i].u == uId)
                {
                    spawns[type].splice(i, 1);
                    break;
                }
            }
        }
    }

    /*
        -- FUNCTION NAME: newLevel
        -- DESCRIPTION: Updates the current floor to the next one
    */
    nl()
    {
        let maze = this.m;
        this.maxlight = 2;
        let hero = this.h;
        let spawns = this.w;
        this.l++;

        if (this.l < 5)
        {
            for (let type in spawns)
            {
                for (let i in spawns[type])
                {
                    this.ds(spawns[type][i].u);
                }
                spawns[type] = [];
            }

            let missing = [];
            let gems = [1,2,3,4];
            let count = 0;
            this.g = {1:0, 2:0, 3:0, 4:0};
            for (let i = 0; i < this.l; i++)
            {
                let index = Math.floor(Math.random() * gems.length);
                missing.push(gems[index]);
                gems.splice(index, 1);
            }
            missing.sort();
            this.missing = missing;

            maze.r(this.l);

            hero.p = maze.spawnPoint;
            hero.r = 2;
            hero.n = 3;
            hero.j = hero.k;

            maze.o(hero.p, 2);

            this.u.l = true;
        }
        else
        {
            this.gg = 9;
        }
        this.c.r();
    }

    /*
        -- FUNCTION NAME: update
        -- DESCRIPTION: Game loop function. It is run every frame
    */
    q()
    {
        let now = (new Date()).getTime();
        let delta = now - this.y;
        this.y = now;
        if (this.e[0] && !this.e[1] && !this.gg)
        {
            this.t += delta/1000;
        }

        //Calculate the logic
        let toUpdate = this.tu;
        for (let id in toUpdate)
        {
            toUpdate[id].u(delta);
        }
        //Then render the results
        this.c.d();

        this.j(this.q.bind(this));
    }

    /*
        -- FUNCTION NAME: light
        -- DESCRIPTION: Updates the range of the player's light in the dungeon
    */
    x(modifier)
    {
        //To prevent players from abusing the light mechanic
        //we remove the difference of gas to the player's tank
        //when the player tries to grow its light to view further
        //without executing a move. It is like if the player has
        //done its previous move with the current light

        let hero = this.h;
        let lightTable = hero.v;
        let maxLight = this.maxlight;
        let prevRange = this.h.r;
        let newRange = Math.min(5, Math.max(0, prevRange + modifier));
        hero.r = newRange;

        if (newRange > maxLight)
        {
            let diff = lightTable[newRange] - lightTable[maxLight];
            hero.gas -= diff;
            this.maxlight = newRange;

            this.m.o(hero.p, newRange);
        }

        this.c.r();
    }

    /*
        -- FUNCTION NAME: displayMap
        -- DESCRIPTION: Triggers the show/hide of the map on screen
    */
    r()
    {
        this.m.map = !this.m.map;
        this.c.r();
    }

    /*
        -- FUNCTION NAME: move
        -- DESCRIPTION: Moves the player in a direction and updates every content in the dungeon

        Direction: 
            0: Left
            1: Top
            2: Right
            3: Bottom
    */
    o(direction)
    {
        let abs = Math.abs;
        let hero = this.h;
        let range = hero.r;
        let maze = this.m;
        let cell = hero.p;
        let audio = this.a;
        let newCell = maze.b(direction, cell);
        let spawns = this.w;
        this.maxlight = range;
        let explored = maze.x;
        let redraw = this.c.r.bind(this.c);

        let canBomb = this.b && newCell[0] >= 0 && newCell[1] >= 0 && newCell[0] < maze.z && newCell[1] < maze.z;
        hero.n = direction;

        let resetForShop = function()
        {
            for (let id in spawns[2])
            {
                spawns[2][id].a = false;
            }
            audio.p(2);
            this.i.d = -1;
            this.pa = true;
            this.u.s = true;

            redraw();
        }
        .bind(this);

        if (!maze.i(newCell[0], newCell[1]))
        {
            let ok = 1;
            let pickup = null;
            for (let s = spawns[1].length - 1; s >= 0; s--)
            {
                let sp = spawns[1][s];
                let spCell = sp.p;
                let isSame = spCell[0] == newCell[0] && spCell[1] == newCell[1];

                ok = ok && (!isSame || sp.w());
                if (isSame)
                {
                    pickup = sp;
                }
            }

            if (ok)
            {
                hero.p = newCell;
                hero.f++;
                this.hitWall = 0;
                maze.o(newCell, range);

                //Stairs
                if (pickup && pickup.id == 9)
                {
                    audio.q();
                    audio.x(6);
                    this.pa = true;

                    this.k(this.nl.bind(this), 1000);
                    redraw();
                    return;
                }
                //Shop
                else if (pickup && pickup.id == 10)
                {
                    resetForShop();
                    return;
                }
                else
                {
                    hero.j -= hero.v[hero.r];

                    if (pickup)
                    {
                        pickup.b();
                    }
                }
            }
        }
        else if (!this.hitWall || canBomb)
        {
            this.hitWall = 1;
            audio.x(1);
            if (canBomb)
            {
                maze.e[newCell[1]][newCell[0]] = 1;
            }
        }

        if (this.hitWall)
        {
            newCell = cell;
        }

        if (hero.j < 0)
        {
            this.gg = 1;
        }
        else if (!this.u.s)
        {
            let allAggro = false;
            for (let id in spawns[2])
            {
                let spawn = spawns[2][id];
                let pos = spawn.p;
                let fctAggro = function(pos){return abs(pos[0] - newCell[0]) <= range && abs(pos[1] - newCell[1]) <= range;};
                let aggro;
                let wasAggro = spawn.a;
                let newPos = pos;
                let fctSameCheck = function(type, direction, spawnCell, heroCell)
                {
                    let fctCheck = function(c1, c2){return c1[0] == c2[0] && c1[1] == c2[1]};
                    if (type > 3)
                    {
                        for (let i = 0; i < 2; i++)
                        {
                            if (fctCheck(heroCell, this.m.b(direction %2 + i*2, spawnCell)))
                            {
                                return 1;
                            }
                        }
                    }
                    return fctCheck(spawnCell, heroCell);
                }
                .bind(this, spawn.id, spawn.n);

                if (!fctSameCheck(newPos, newCell) && !fctSameCheck(newPos, cell))
                {
                    if (wasAggro)
                    {
                        newPos = maze.f(pos, newCell, spawn.id == 2);
                        if (!newPos)
                        {
                            newPos = pos;
                        }
                    }
                    else
                    {
                        if (Math.random() < 0.3)
                        {
                            let newPos = maze.a(pos);
                        }
                    }

                    if (newPos != pos)
                    {
                        let direction;
                        if (newPos[0] != pos[0])
                        {
                            direction = newPos[0] < pos[0] ? 0 : 2;
                        }
                        else
                        {
                            direction = newPos[1] < pos[1] ? 1 : 3;
                        }

                        spawn.p = newPos;
                        spawn.n = direction;
                        spawn.f++;
                    }

                    if (!fctSameCheck(newPos, newCell))
                    {
                        aggro = fctAggro(newPos);
                        spawn.a = aggro;

                        if (!wasAggro && aggro)
                        {
                            audio.q();
                            this.k(function(){audio.x(0);}, 200);
                            this.k(function(){audio.p(1);}, 900);
                        }
                        allAggro = allAggro || aggro;
                        spawn.a = aggro;
                    }
                }
                else
                {
                    audio.x(2);
                    hero.h--;
                    this.ds(spawn.u);
                    if (hero.h <= 0)
                    {
                        this.gg = 2;
                    }
                }
            }
            if (!allAggro)
            {
                audio.p(0);
            }
        }
        else
        {
            resetForShop();
        }

        if (this.gg)
        {
            this.k(function(){ this.e[2] = true;this.a.q();}.bind(this), 1000);
        }

        redraw();
    }
}