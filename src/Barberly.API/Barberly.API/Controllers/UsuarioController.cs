using Barberly.API.Domain.DTOs.UsuarioDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
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

        // Somente usuários autenticados podem consultar usuários.
        [Authorize(Roles = "Usuario")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> Get(int id)
        {
            var usuario = await _usuarioService.PegarUsuarioAsync(id);
            return Ok(usuario);
        }

        // Somente usuários autenticados podem atualizar dados.
        [Authorize(Roles = "Usuario")]
        [HttpPut("{id}")]
        public async Task<ActionResult<Usuario>> Put(int id,AtualizarUsuarioRequest request)
        {
            var usuario = await _usuarioService.AtualizarUsuarioAsync(id, request);
            return Ok(usuario);
        }

        // Somente usuários autenticados podem excluir usuários.
        [Authorize(Roles = "Usuario")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var usuario = await _usuarioService.DeletarUsuarioAsync(id);
            return Ok(usuario);
        }
    }
}