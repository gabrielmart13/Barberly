using Barberly.API.Data;
using Barberly.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicoController : ControllerBase
    {
        private readonly DataContext _context;
        public ServicoController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Servico>>> Get()
        {
            var servicos = await _context.Servicos.ToListAsync();
            return Ok(servicos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Servico>> Get(int id)
        {
            var servicos = await _context.Servicos.FirstOrDefaultAsync(x => x.IdServico == id);
            if(servicos == null)
            {
                return NotFound("ID não encontrado");
            }
            return Ok(servicos);
        }

        [HttpPost]
        public async Task<ActionResult<Servico>> Post(Servico servico)
        {
            await _context.Servicos.AddAsync(servico);
            await _context.SaveChangesAsync();

            return Ok(servico);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Servico>> Put(int id, Servico servico)
        {
            var servicos = await _context.Servicos.FirstOrDefaultAsync(x => x.IdServico == id);
            if(servicos == null)
            {
                return NotFound("ID não encontrado");
            }
            servicos.IdBarbearia = servico.IdBarbearia;
            servicos.IdCategoria = servico.IdCategoria;
            servicos.Valor = servico.Valor;
            servicos.Nome = servico.Nome;
            servicos.TempoEstimado = servico.TempoEstimado;

            await _context.SaveChangesAsync();
            return Ok(servicos);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var servicos = await _context.Servicos.FirstOrDefaultAsync(x => x.IdServico == id);
            if(servicos == null)
            {
                return NotFound("ID não encontrado");
            }

            _context.Servicos.Remove(servicos);
            await _context.SaveChangesAsync();
            return NoContent();

        }
    }
}
