using Barberly.API.Data;
using Barberly.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AvaliacaoController : ControllerBase
    {
        private readonly DataContext _context;
        public AvaliacaoController (DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult <List<Avaliacao>>> Get()
        {
            var avaliacoes = await _context.Avaliacoes.ToListAsync();
            return Ok(avaliacoes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult <Avaliacao>> Get(int id)
        {
            var avaliacoes = await _context.Avaliacoes.FirstOrDefaultAsync(x => x.IdAvaliacao == id);
            if(avaliacoes == null)
            {
                return NotFound();
            }
            
            return Ok(avaliacoes);
        }

        [HttpPost]
        public async Task<ActionResult <Avaliacao>> Post(Avaliacao avaliacao)
        {
            await _context.Avaliacoes.AddAsync(avaliacao);
            await _context.SaveChangesAsync();

            return Ok(avaliacao);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult <Avaliacao>> Put(int id, Avaliacao avaliacao)
        {
            var avaliacoes = await _context.Avaliacoes.FirstOrDefaultAsync(x => x.IdAvaliacao == id);
            if (avaliacoes == null)
            {
                return NotFound();
            }

            avaliacoes.Agendamento = avaliacao.Agendamento;
            avaliacoes.Comentario = avaliacao.Comentario;
            avaliacoes.DataAvaliacao = avaliacao.DataAvaliacao;
            avaliacoes.Nota = avaliacao.Nota;
            avaliacoes.IdAgendamento = avaliacao.IdAgendamento;
            avaliacoes.IdUsuario = avaliacao.IdUsuario;

            await _context.SaveChangesAsync();

            return Ok(avaliacoes);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var avaliacoes = await _context.Avaliacoes.FirstOrDefaultAsync(x => x.IdAvaliacao == id);
            if (avaliacoes == null)
            {
                return NotFound();
            }

            _context.Avaliacoes.Remove(avaliacoes);
            await _context.SaveChangesAsync();

            return Ok(avaliacoes);
        }

    }
}
