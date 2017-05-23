export default (dataString: any): any => {
    const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response: any = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
};
