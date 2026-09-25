using Barberly.API.Data;
using Barberly.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DonoBarbeariaController : ControllerBase
    {
        private readonly DataContext _context;
        public DonoBarbeariaController (DataContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DonoBarbearia>> Get(int id)
        {
            var donobarbearias = await _context.DonoBarbearias.FirstOrDefaultAsync(x => x.IdDonoBarbearia == id);
            if(donobarbearias == null)
            {
                return NotFound();
            }
            return Ok(donobarbearias);
        }

        [HttpPost]
        public async Task<ActionResult<DonoBarbearia>> Post(DonoBarbearia donobarbearia)
        {
            await _context.DonoBarbearias.AddAsync(donobarbearia);
            await _context.SaveChangesAsync();

            return Ok(donobarbearia);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<DonoBarbearia>> Put(int id, DonoBarbearia donobarbearia)
        {
            var donobarbearias = await _context.DonoBarbearias.FirstOrDefaultAsync(x => x.IdDonoBarbearia == id);
            if (donobarbearias == null)
            {
                return NotFound();
            }
            donobarbearias.Nome = donobarbearia.Nome;
            donobarbearias.Senha = donobarbearia.Senha;
            donobarbearias.Email = donobarbearia.Email;
            donobarbearias.Contato = donobarbearia.Contato;

            await _context.SaveChangesAsync();
            return Ok(donobarbearias);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var donobarbearias = await _context.DonoBarbearias.FirstOrDefaultAsync(x => x.IdDonoBarbearia == id);
            if (donobarbearias == null)
            {
                return NotFound();
            }

            _context.DonoBarbearias.Remove(donobarbearias);
            await _context.SaveChangesAsync();

            return Ok(donobarbearias);
        }
    }
}
