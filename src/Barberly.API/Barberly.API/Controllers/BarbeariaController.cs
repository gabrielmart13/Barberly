using Barberly.API.Data;
using Barberly.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BarbeariaController : ControllerBase
    {
        private readonly DataContext _context;
        public BarbeariaController (DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Barbearia>>> Get()
        {
            var barbearias = await _context.Barbearias.Include(x => x.DonoBarbearia).ToListAsync();
            return Ok(barbearias);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Barbearia>> Get(int id)
        {
            var barbearias = await _context.Barbearias.Include(x=> x.DonoBarbearia).FirstOrDefaultAsync(x => x.IdBarbearia == id);
            if(barbearias == null)
            {
                return NotFound();
            }

            return Ok(barbearias);
        }

        [HttpPost]
        public async Task<ActionResult<Barbearia>> Post(Barbearia barbearia)
        {
            await _context.Barbearias.AddAsync(barbearia);
            await _context.SaveChangesAsync();

            return Ok(barbearia);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Barbearia>> Put(int id, Barbearia barbearia)
        {
            var barbearias = await _context.Barbearias.FirstOrDefaultAsync(x => x.IdBarbearia == id);
            if (barbearias == null)
            {
                return NotFound();
            }

            barbearias.Contato = barbearia.Contato;
            barbearias.Descricao = barbearia.Descricao;
            barbearias.Endereco = barbearia.Endereco;
            barbearias.IdDonoBarbearia = barbearia.IdDonoBarbearia;
            barbearias.Nome = barbearia.Nome;

            await _context.SaveChangesAsync();
            return Ok(barbearias);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var barbearias = await _context.Barbearias.FirstOrDefaultAsync(x => x.IdBarbearia == id);
            if (barbearias == null)
            {
                return NotFound();
            }
            _context.Barbearias.Remove(barbearias);
            await _context.SaveChangesAsync();

            return Ok(barbearias);
        }
    }
}
