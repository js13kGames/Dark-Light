export default class Prop
{
    /*
        Prop IDs:
            - 1-4 : Crystals
            - 6   : Light cell
            - 7   : Coin
            - 9   : Stairs
            - 10  : Shop
    */
    constructor(id, uId, cell, icon, game)
    {
        this.id = id;
        this.u = uId;
        this.y = game;
        this.c = icon;
        this.p = cell;
    }

    /*
        -- FUNCTION NAME: setTransform
        -- DESCRIPTION: Defines the transform position/size of the prop on screen
    */
    t(x, y, w, h)
    {
        this.z = [x, y, w, h];
    }

    /*
        -- FUNCTION NAME: walk
        -- DESCRIPTION: Checks if this prop can be walked over by the player
    */
    w()
    {
        return this.q();
    }

    /*
        -- FUNCTION NAME: unlocked
        -- DESCRIPTION: Checks if this prop is in an unlocked state
    */
    q()
    {
        let unlocked = 1;
        if (this.id == 9)
        {
            let g = this.y;
            let m = g.missing;
            let ge = g.g;
            for (let gId in m)
            {
                unlocked = unlocked && ge[m[gId]];
            }
        }
        return unlocked;
    }

    /*
        -- FUNCTION NAME: pickUp
        -- DESCRIPTION: Action to execute when the player picks up this propZ
    */
    b()
    {
        let id = this.id;
        if (id < 8)
        {
            let g = this.y;
            g.a.x((id > 4 ? id - 3 : 5));

            if (id > 6)
            {
                g.z++;    
            }
            else if (id > 5)
            {
                let gas = g.h.j;
                let maxgas = g.h.k;
                g.h.j = Math.min(maxgas, gas + Math.ceil(maxgas / 2));
            }
            else
            {
                g.g[id] = 1;
            }
            g.ds(this.u);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////
    //
    //  DISPLAY FUNCTIONS
    //
    //////////////////////////////////////////////////////////////////////////////////

    /*
        -- FUNCTION NAME: draw
        -- DESCRIPTION: Visual draws this content on the screen
    */
    d()
    {   
        let id = this.id;
        let light = this.g;
        let canvas = this.y.c;

        if (light || id < 8)
        {
            let ratio = 0.75;
            if (id > 8)
            {
                ratio = 1;
            }
            let t = this.z;
            let w = t[2] * ratio;
            let h = t[3] * ratio;
            this.c.d(this.id - (this.q() ? 0 : 1), t[0] + (t[2] - w) / 2, t[1] + (t[3] - h) / 2, w, h);

            if (!light)
            {
                canvas.f(0.9);
                canvas.o(t[0], t[1], t[2], t[3], 0, -1);
                canvas.f(1);
            }
        }
    }
}