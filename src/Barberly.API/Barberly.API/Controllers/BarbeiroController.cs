using Barberly.API.Data;
using Barberly.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BarbeiroController : ControllerBase
    {
        private readonly DataContext _context;
        public BarbeiroController (DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Barbeiro>>> Get()
        {
            var barbeiros = await _context.Barbeiros.ToListAsync();
            return Ok(barbeiros);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Barbeiro>> Get(int id)
        {
            var barbeiros = await _context.Barbeiros.FirstOrDefaultAsync(x => x.IdBarbeiro == id);
            if(barbeiros == null)
            {
                return NotFound("ID não encontrado");
            }

            return Ok(barbeiros);
        }

        [HttpPost]
        public async Task<ActionResult<Barbeiro>> Post(Barbeiro barbeiro)
        {
            await _context.Barbeiros.AddAsync(barbeiro);
            await _context.SaveChangesAsync();

            return Ok(barbeiro);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Barbeiro>> Put(int id, Barbeiro barbeiro)
        {
            var barbeiros = await _context.Barbeiros.FirstOrDefaultAsync(x => x.IdBarbeiro == id);
            if (barbeiros == null)
            {
                return NotFound("ID não encontrado");
            }
            barbeiros.Contato = barbeiro.Contato;
            barbeiros.Email = barbeiro.Email;
            barbeiros.Experiencia = barbeiro.Experiencia;
            barbeiros.IdBarbearia = barbeiro.IdBarbearia;
            barbeiros.Nome = barbeiro.Nome;

            await _context.SaveChangesAsync();
            return Ok(barbeiros);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var barbeiros = await _context.Barbeiros.FirstOrDefaultAsync(x => x.IdBarbeiro == id);
            if (barbeiros == null)
            {
                return NotFound("ID não encontrado");
            }

            _context.Barbeiros.Remove(barbeiros);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
