
export default class Save
{
    constructor(game)
    {
        this.d;
        this.k = "darklight_save";
        this.l();
    }

    /*
        -- FUNCTION NAME: save
        -- DESCRIPTION: Persist data in the local storage of the player's browser
    */
    s()
    {
        window.localStorage.setItem(this.k, btoa(JSON.stringify(this.d)));
    }

    /*
        -- FUNCTION NAME: load
        -- DESCRIPTION: Loads data from the local storage of the player's browser
    */
    l()
    {
        let data = window.localStorage.getItem(this.k);
        if (data)
        {
            data = JSON.parse(atob(data));
        }
        else
        {
            data = {};
        }
        this.d = data;
    }
}