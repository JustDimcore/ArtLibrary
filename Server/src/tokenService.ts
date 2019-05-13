export class TokenService {
    
    private _tokensByEmail: { [email: string] : string} = {};
    private _emailByToken: { [token: string] : string} = {};

    getToken(email: string) {
        return this._tokensByEmail[email];
    }

    getEmail(token: string) {
        return this._emailByToken[token];
    }

    saveToken(email: string, token: string) {
        this._tokensByEmail[email] = token;
        this._emailByToken[token] = email;
    }
}