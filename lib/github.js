const { GH_TOKEN, GH_LOGIN, GH_REPO } = process.env;
const GitHub = require('github-api');
function handler(res) {
    const result = res.data || res;
    if (result) {
        result.status = false;
        result.code = res.status;
    }

    return result;
}

class GitHubClient extends GitHub {
    constructor() {
        super({
            token: GH_TOKEN
        });
        this.repo = this.getRepo(GH_LOGIN, GH_REPO)
    }

    async getContent (filename) {
        let res;
        try {
            const { data } = await this.repo.getContents('master', filename, true)
            res = { status: true, data }
        } catch (error) {
            console.error('getContent error:', error);
            res = handler(error.response)
        }
        return res;
    }

    async writeFile (name, content, options ) {
        let res;
        try {
            const { data } = await this.repo.writeFile('master', name, content, `update file ${name}`, options)
            res = { status: true, data }
        } catch (error) {
            console.error('writeFile error:', error);
            res = handler(error.response || { message: error.message })
        }
        return res;
    }
}

module.exports = GitHubClient;
