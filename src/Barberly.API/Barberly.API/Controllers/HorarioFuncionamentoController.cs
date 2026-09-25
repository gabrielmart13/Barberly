using Barberly.API.Data;
using Barberly.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HorarioFuncionamentoController : ControllerBase
    {
        private readonly DataContext _context;
        public HorarioFuncionamentoController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<HorarioFuncionamento>>> Get()
        {
            var horariosfuncionamento = await _context.HorarioFuncionamentos.ToListAsync();
            return Ok(horariosfuncionamento);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<HorarioFuncionamento>> Get(int id)
        {
            var horariosfuncionamento = await _context.HorarioFuncionamentos.FirstOrDefaultAsync(x => x.IdHorario == id);
            if(horariosfuncionamento == null)
            {
                return NotFound("ID não encontrado");
            }
            return Ok(horariosfuncionamento);
        }

        [HttpPost]
        public async Task<ActionResult<HorarioFuncionamento>> Post(HorarioFuncionamento horariofuncionamento)
        {
            await _context.HorarioFuncionamentos.AddAsync(horariofuncionamento);
            await _context.SaveChangesAsync();

            return Ok(horariofuncionamento);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<HorarioFuncionamento>> Put(int id, HorarioFuncionamento horariofuncionamento)
        {
            var horariosfuncionamento = await _context.HorarioFuncionamentos.FirstOrDefaultAsync(x => x.IdHorario == id);
            if(horariosfuncionamento == null)
            {
                return NotFound("ID não encontrado");
            }

            horariosfuncionamento.HoraAbertura = horariofuncionamento.HoraAbertura;
            horariosfuncionamento.HoraFechamento = horariofuncionamento.HoraFechamento;
            horariosfuncionamento.DiaSemana = horariofuncionamento.DiaSemana;
            horariosfuncionamento.IdBarbearia = horariofuncionamento.IdBarbearia;

            await _context.SaveChangesAsync();
            return Ok(horariosfuncionamento);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var horariosfuncionamento = await _context.HorarioFuncionamentos.FirstOrDefaultAsync(x => x.IdHorario == id);
            if(horariosfuncionamento == null)
            {
                return NotFound("ID não encontrado");
            }

            _context.HorarioFuncionamentos.Remove(horariosfuncionamento);
            _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
