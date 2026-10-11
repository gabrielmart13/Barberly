using Barberly.API.Domain.DTOs.AuthDTO;
using Barberly.API.Domain.DTOs.DonoBarbeariaDTO;
using Barberly.API.Domain.DTOs.UsuarioDTO;
using Barberly.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        // POST /api/Auth/usuario
        [AllowAnonymous]
        [HttpPost("usuario")]
        public async Task<IActionResult> CriarUsuario(
            [FromBody] CriarUsuarioRequest request)
        {
            var criado = await _authService.CriarUsuarioAsync(request);

            if (!criado)
            {
                return Conflict(new
                {
                    mensagem = "Já existe uma conta com esse e-mail."
                });
            }

            return Ok(new
            {
                mensagem = "Conta de cliente criada com sucesso."
            });
        }

        // POST /api/Auth/dono
        [AllowAnonymous]
        [HttpPost("dono")]
        public async Task<IActionResult> CriarDono(
            [FromBody] CriarDonoBarbeariaRequest request)
        {
            var criado = await _authService.CriarDonoBarbeariaAsync(request);

            if (!criado)
            {
                return Conflict(new
                {
                    mensagem = "Já existe uma conta com esse e-mail."
                });
            }

            return Ok(new
            {
                mensagem = "Conta de dono criada com sucesso."
            });
        }

        // POST /api/Auth/login
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(
            [FromBody] LoginRequest request)
        {
            var resultado = await _authService.LoginAsync(request);

            if (resultado == null)
            {
                return Unauthorized(new
                {
                    mensagem = "E-mail ou senha inválidos."
                });
            }

            return Ok(resultado);
        }
    }
}