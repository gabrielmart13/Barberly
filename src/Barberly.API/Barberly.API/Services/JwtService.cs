
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Barberly.API.Domain.DTOs.AuthDTO;

namespace Barberly.API.Services
{
    public class JwtService
    {
        private readonly IConfiguration _configuration;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public LoginResponse GerarToken(
            int id,
            string nome,
            string email,
            string tipoUsuario)
        {
            var chaveConfigurada = _configuration["Jwt:Key"];

            if (string.IsNullOrWhiteSpace(chaveConfigurada))
            {
                throw new InvalidOperationException(
                    "A chave JWT não foi configurada."
                );
            }

            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            if (string.IsNullOrWhiteSpace(issuer) ||
                string.IsNullOrWhiteSpace(audience))
            {
                throw new InvalidOperationException(
                    "Issuer ou Audience do JWT não configurado."
                );
            }

            // O token expira oito horas após sua emissão.
            var expiracao = DateTime.UtcNow.AddHours(8);

            // Claims são informações que identificam a conta.
            // A role diferencia cliente de dono da barbearia.
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, id.ToString()),
                new Claim(ClaimTypes.Name, nome),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, tipoUsuario)
            };

            var chave = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(chaveConfigurada)
            );

            var credenciais = new SigningCredentials(
                chave,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: expiracao,
                signingCredentials: credenciais
            );

            var tokenString = new JwtSecurityTokenHandler()
                .WriteToken(token);

            // Retornamos o token e os dados públicos da conta.
            return new LoginResponse
            {
                Token = tokenString,
                TipoUsuario = tipoUsuario,
                Id = id,
                Nome = nome,
                Email = email,
                ExpiraEmUtc = expiracao
            };
        }
    }
}
