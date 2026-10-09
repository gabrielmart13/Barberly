using Barberly.API.Data;
using Barberly.API.Domain.DTOs.AvaliacaoDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AvaliacaoController : ControllerBase
    {
        private readonly IAvaliacaoService _avaliacaoService;
        public AvaliacaoController(IAvaliacaoService avaliacaoService)
        {
            _avaliacaoService = avaliacaoService;
        }

        [HttpGet]
        public async Task<ActionResult <List<Avaliacao>>> Get()
        {
            var avaliacoes = await _avaliacaoService.PegarAvaliacoesAsync();
            return Ok(avaliacoes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult <Avaliacao>> Get(int id)
        {
            var avaliacoes = await _avaliacaoService.PegarAvaliacaoAsync(id);

            return Ok(avaliacoes);
        }

        [HttpPost]
        public async Task<ActionResult <Avaliacao>> Post(CriarAvaliacaoRequest request)
        {
            Avaliacao avaliacao = new Avaliacao
            {
                Nota = request.Nota,
                Comentario = request.Comentario,
                IdUsuario = request.IdUsuario,
                IdAgendamento = request.IdAgendamento
            };

            await _avaliacaoService.CriarAvaliacaoAsync(avaliacao);
            return Ok(avaliacao);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult <Avaliacao>> Put(int id, AtualizarAvaliacaoRequest request)
        {
            var avaliacaoExist = await _avaliacaoService.PegarAvaliacaoAsync(id);
            Avaliacao avaliacao = new Avaliacao
            {
                Nota = request.Nota,
                Comentario = request.Comentario,
                IdAgendamento = avaliacaoExist.IdAgendamento,
                IdUsuario = avaliacaoExist.IdUsuario

            };
            

            await _avaliacaoService.AtualizarAvaliacaoAsync(id,avaliacao);
            return Ok(avaliacao);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await _avaliacaoService.DeletarAvaliacaoAsync(id));
        }

    }
}
