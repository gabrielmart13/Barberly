using Barberly.API.Data;
using Barberly.API.Models;
using Microsoft.AspNetCore.Mvc;

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
        public ActionResult<Usuario> Get(int id)
        {
            return new Usuario();
        }

        [HttpPost]
        public ActionResult<Usuario> Post(Usuario usuario)
        {
            return new Usuario();
        }

        [HttpPut("{id}")]
        public ActionResult<Usuario> Put(int id, Usuario usuario)
        {
            return new Usuario();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            return NoContent();
        }
    }
}
