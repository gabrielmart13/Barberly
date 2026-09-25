using Barberly.API.Data;
using Barberly.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AgendamentoController : ControllerBase
    {
        private readonly DataContext _context;
        public AgendamentoController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Agendamento>>> Get()
        {
            var agendamentos = await _context.Agendamentos.ToListAsync();
            return Ok(agendamentos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Agendamento>> Get(int id)
        {
            var agendamentos = await _context.Agendamentos
                .FirstOrDefaultAsync(x => x.IdAgendamento == id);

            if (agendamentos == null)
            {
                return NotFound("ID não encontrado");
            }

            return Ok(agendamentos);
        }

        [HttpPost]
        public async Task<ActionResult<Agendamento>> Post(Agendamento agendamento)
        {
            await _context.Agendamentos.AddAsync(agendamento);
            await _context.SaveChangesAsync();

            return Ok(agendamento);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var agendamentos = await _context.Agendamentos
                .FirstOrDefaultAsync(x => x.IdAgendamento == id);

            if (agendamentos == null)
            {
                return NotFound("ID não encontrado");
            }

            _context.Agendamentos.Remove(agendamentos);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}