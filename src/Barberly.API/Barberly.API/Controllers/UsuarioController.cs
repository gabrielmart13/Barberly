using Barberly.API.Domain.DTOs.UsuarioDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;

        public UsuarioController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> Get(int id)
        {
            var usuario = await _usuarioService.PegarUsuarioAsync(id);

            return Ok(usuario);
        }

        [HttpPost]
        public async Task<ActionResult<Usuario>> Post(
            CriarUsuarioRequest request)
        {
            Usuario usuario = new Usuario
            {
                Nome = request.Nome,
                Email = request.Email,
                Senha = request.Senha,
                Contato = request.Contato
            };

            await _usuarioService.CriarUsuarioAsync(usuario);

            return Ok(usuario);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Usuario>> Put(
            int id,
            AtualizarUsuarioRequest request)
        {
            Usuario usuario = new Usuario
            {
                Nome = request.Nome,
                Email = request.Email,
                Senha = request.Senha,
                Contato = request.Contato
            };

            await _usuarioService.AtualizarUsuarioAsync(id, usuario);

            return Ok(usuario);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            return Ok(
                await _usuarioService.DeletarUsuarioAsync(id)
            );
        }
    }
}