
using Microsoft.AspNetCore.Identity;

namespace Barberly.API.Services
{
    public class PasswordService
    {
        // Utilizamos o PasswordHasher oficial do ASP.NET Core.
        // O tipo object permite usar o mesmo serviço para Usuario
        // e DonoBarbearia, que são models diferentes.
        private readonly PasswordHasher<object> _hasher = new();

        public string HashPassword(string senha)
        {
            // Nunca salve a senha original no banco.
            return _hasher.HashPassword(new object(), senha);
        }

        public bool VerificarSenha(string senha, string senhaHash)
        {
            var resultado = _hasher.VerifyHashedPassword(
                new object(),
                senhaHash,
                senha
            );

            // SuccessRehashNeeded também significa que a senha
            // foi validada. O hash poderá ser atualizado depois.
            return resultado == PasswordVerificationResult.Success
                || resultado == PasswordVerificationResult.SuccessRehashNeeded;
        }
    }
}
