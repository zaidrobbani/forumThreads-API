const LoginUserUseCase = require('../../../../Applications/use_case/LoginUserUseCase');
const LogoutUserUseCase = require('../../../../Applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationsUseCase = require('../../../../Applications/use_case/RefreshAuthenticationsUseCase');

class AuthenticationsHandler {
    constructor(container) {
        this._container = container;

        this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
        this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
        this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    }

    async postAuthenticationHandler(request, h) {
        const loginUserUseCase = this._container.getInstance(LoginUserUseCase.name);
        const authentications = await loginUserUseCase.execute(request.payload);
        const response = h.response({
            status: 'success',
            data: {
                ...authentications,
            },
        });
        response.code(201);
        return response;
    }

    async deleteAuthenticationHandler(request, h) {
        const logoutUserUseCase = this._container.getInstance(LogoutUserUseCase.name);
        await logoutUserUseCase.execute(request.payload);
        const response = h.response({
            status: 'success',
            data: {
                message: 'Logout berhasil',
            }
        })

        response.code(200);
        return response;
    }

    async putAuthenticationHandler(request, h) {
        const refreshAuthenticationsUseCase = this._container.getInstance(RefreshAuthenticationsUseCase.name);
        const accessToken = await refreshAuthenticationsUseCase.execute(request.payload);
        const response = h.response({
            status: 'success',
            data: {
                accessToken,
            },
        })
        response.code(200);
        return response;
    }
}

module.exports = AuthenticationsHandler;