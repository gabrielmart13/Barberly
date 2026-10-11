using Barberly.API.Data;
using Barberly.API.Domain.DTOs.AuthDTO;
using Barberly.API.Domain.DTOs.DonoBarbeariaDTO;
using Barberly.API.Domain.DTOs.UsuarioDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Barberly.API.Services
{
    public class AuthService
    {
        private readonly DataContext _context;
        private readonly PasswordService _passwordService;
        private readonly JwtService _jwtService;

        public AuthService(
            DataContext context,
            PasswordService passwordService,
            JwtService jwtService)
        {
            _context = context;
            _passwordService = passwordService;
            _jwtService = jwtService;
        }

        // Normaliza o e-mail para evitar diferenças
        // causadas por espaços ou letras maiúsculas.
        private static string NormalizarEmail(string email)
        {
            return email.Trim().ToLowerInvariant();
        }

        // Valida os dados recebidos antes de cadastrar.
        private static void ValidarCadastro(
            string? nome,
            string? email,
            string? senha,
            string? contato)
        {
            if (string.IsNullOrWhiteSpace(nome) ||
                string.IsNullOrWhiteSpace(email) ||
                string.IsNullOrWhiteSpace(senha) ||
                string.IsNullOrWhiteSpace(contato))
            {
                throw new Barberly.API.Exceptions.ValidationException(
                    "Nome, e-mail, senha e contato são obrigatórios.");
            }

            if (senha.Length < 8)
            {
                throw new Barberly.API.Exceptions.ValidationException(
                    "A senha deve ter pelo menos 8 caracteres.");
            }
        }

        // Verifica se o e-mail já está sendo utilizado
        // por um cliente ou por um dono de barbearia.
        private async Task<bool> EmailExisteAsync(string email)
        {
            var emailUsuarioExiste = await _context.Usuarios
                .AnyAsync(u => u.Email.ToLower() == email);

            var emailDonoExiste = await _context.DonoBarbearias
                .AnyAsync(d => d.Email.ToLower() == email);

            return emailUsuarioExiste || emailDonoExiste;
        }

        // Cadastro de cliente.
        public async Task<bool> CriarUsuarioAsync(
            CriarUsuarioRequest request)
        {
            if (request == null)
            {
                throw new Barberly.API.Exceptions.ValidationException(
                    "Os dados do usuário não podem ser nulos.");
            }

            ValidarCadastro(
                request.Nome,
                request.Email,
                request.Senha,
                request.Contato);

            var email = NormalizarEmail(request.Email);

            if (await EmailExisteAsync(email))
            {
                return false;
            }

            var usuario = new Usuario
            {
                Nome = request.Nome.Trim(),
                Email = email,
                Contato = request.Contato.Trim(),

                // Salva somente o hash da senha.
                Senha = _passwordService.HashPassword(request.Senha)
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return true;
        }

        // Cadastro de dono de barbearia.
        public async Task<bool> CriarDonoBarbeariaAsync(
            CriarDonoBarbeariaRequest request)
        {
            if (request == null)
            {
                throw new Barberly.API.Exceptions.ValidationException(
                    "Os dados do dono não podem ser nulos.");
            }

            ValidarCadastro(
                request.Nome,
                request.Email,
                request.Senha,
                request.Contato);

            var email = NormalizarEmail(request.Email);

            if (await EmailExisteAsync(email))
            {
                return false;
            }

            var dono = new DonoBarbearia
            {
                Nome = request.Nome.Trim(),
                Email = email,
                Contato = request.Contato.Trim(),

                // Salva somente o hash da senha.
                Senha = _passwordService.HashPassword(request.Senha)
            };

            _context.DonoBarbearias.Add(dono);
            await _context.SaveChangesAsync();

            return true;
        }

        // Login compartilhado entre cliente e dono.
        public async Task<LoginResponse?> LoginAsync(
            LoginRequest request)
        {
            if (request == null ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Senha))
            {
                throw new Barberly.API.Exceptions.ValidationException(
                    "E-mail e senha são obrigatórios.");
            }

            var email = NormalizarEmail(request.Email);

            var usuario = await _context.Usuarios
                .SingleOrDefaultAsync(u => u.Email.ToLower() == email);

            var dono = await _context.DonoBarbearias
                .SingleOrDefaultAsync(d => d.Email.ToLower() == email);

            // Não escolhe uma conta arbitrariamente se houver
            // o mesmo e-mail cadastrado nas duas tabelas.
            if (usuario != null && dono != null)
            {
                return null;
            }

            if (usuario != null)
            {
                var senhaValida = _passwordService.VerificarSenha(
                    request.Senha,
                    usuario.Senha);

                if (!senhaValida)
                {
                    return null;
                }

                return _jwtService.GerarToken(
                    usuario.IdUsuario,
                    usuario.Nome,
                    usuario.Email,
                    "Usuario");
            }

            if (dono != null)
            {
                var senhaValida = _passwordService.VerificarSenha(
                    request.Senha,
                    dono.Senha);

                if (!senhaValida)
                {
                    return null;
                }

                return _jwtService.GerarToken(
                    dono.IdDonoBarbearia,
                    dono.Nome,
                    dono.Email,
                    "DonoBarbearia");
            }

            // Não revela se o e-mail está cadastrado.
            return null;
        }
    }
}
