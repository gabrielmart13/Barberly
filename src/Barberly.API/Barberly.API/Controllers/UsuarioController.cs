using Barberly.API.Data;
using Barberly.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly DataContext _context;
        public UsuarioController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> Get(int id)
        {
            var usuarios = await _context.Usuarios.FirstOrDefaultAsync(x => x.IdUsuario == id);
            if(usuarios == null)
            {
                return NotFound("ID não encontrado");
            }

            return Ok(usuarios);
        }

        [HttpPost]
        public async Task<ActionResult<Usuario>> Post(Usuario usuario)
        {
            await _context.Usuarios.AddAsync(usuario);
            await _context.SaveChangesAsync();

            return Ok(usuario);

        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Usuario>> Put(int id, Usuario usuario)
        {
            var usuarios = await _context.Usuarios.FirstOrDefaultAsync(x => x.IdUsuario == id);
            if(usuarios == null)
            {
                return NotFound("ID não encontrado");
            }

            usuarios.Contato = usuario.Contato;
            usuarios.Nome = usuario.Nome;
            usuarios.Email = usuario.Email;
            usuarios.Senha = usuario.Senha;

            await _context.SaveChangesAsync();


            return Ok(usuarios);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var usuarios = await _context.Usuarios.FirstOrDefaultAsync(x => x.IdUsuario == id);

            if(usuarios == null)
            {
                return NotFound("ID não encontrado");
            }
            _context.Usuarios.Remove(usuarios);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
