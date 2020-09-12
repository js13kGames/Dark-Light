export default class Character
{
    constructor(cell, canvas, maze, uId = 0)
    {
        this.u = uId;//Unique id to identify same objects
        this.c = canvas;
        this.m = maze;
        this.p = cell;
        this.f = 0;
        this.n = 3;
        this.r = 999;
    }

    /*
        -- FUNCTION NAME: draw
        -- DESCRIPTION: Visual draws this content on the screen
    */
    d()
    {
        this.s(this.f%2, this.n);
    }

    /*
        -- FUNCTION NAME: setTransform
        -- DESCRIPTION: Defines the transform position/size of the character on screen
    */
    t(x, y, w, h)
    {
        this.z = [x, y, w, h];
    }

    /*
        -- FUNCTION NAME: isLight
        -- DESCRIPTION: Calculates if the current character affects the lighting of a tile
    */
    l(col, row)
    {
        let cell = this.p;
        let abs = Math.abs;
        let range = this.r;

        return abs(cell[0] - col) <= range && abs(cell[1] - row) <= range
    }
}