
using Barberly.API.Domain.DTOs.AvaliacaoDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult <List<Avaliacao>>> Get()
        {
            var avaliacoes = await _avaliacaoService.PegarAvaliacoesAsync();
            return Ok(avaliacoes);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult <Avaliacao>> Get(int id)
        {
            var avaliacoes = await _avaliacaoService.PegarAvaliacaoAsync(id);

            return Ok(avaliacoes);
        }

        [Authorize(Roles = "Usuario")]
        [HttpPost]
        public async Task<ActionResult <Avaliacao>> Post(CriarAvaliacaoRequest request)
        {
            var avaliacao = await _avaliacaoService.CriarAvaliacaoAsync(request);
            return Ok(avaliacao);
        }

        [Authorize(Roles = "Usuario")]
        [HttpPut("{id}")]
        public async Task<ActionResult <Avaliacao>> Put(int id, AtualizarAvaliacaoRequest request)
        {
            var avaliacaoExist = await _avaliacaoService.AtualizarAvaliacaoAsync(id, request);
            return Ok(avaliacaoExist);
        }

        [Authorize(Roles = "Usuario")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await _avaliacaoService.DeletarAvaliacaoAsync(id));
        }

    }
}
