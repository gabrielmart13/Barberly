using Barberly.API.Domain.DTOs.ServicoDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicoController : ControllerBase
    {
        private readonly IServicoService _servicoService;

        public ServicoController(IServicoService servicoService)
        {
            _servicoService = servicoService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Servico>>> Get()
        {
            var servicos = await _servicoService.PegarTodosServicosAsync();

            return Ok(servicos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Servico>> Get(int id)
        {
            var servico = await _servicoService.PegarServicoAsync(id);

            return Ok(servico);
        }

        [HttpPost]
        public async Task<ActionResult<Servico>> Post(CriarServicoRequest request)
        {
            Servico servico = new Servico
            {
                IdBarbearia = request.IdBarbearia,
                IdCategoria = request.IdCategoria,
                Valor = request.Valor,
                Nome = request.Nome,
                TempoEstimado = request.TempoEstimado
            };

            await _servicoService.CriarServicoAsync(servico);

            return Ok(servico);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Servico>> Put(
            int id,
            AtualizarServicoRequest request)
        {
            Servico servico = new Servico
            {
                IdBarbearia = request.IdBarbearia,
                IdCategoria = request.IdCategoria,
                Valor = request.Valor,
                Nome = request.Nome,
                TempoEstimado = request.TempoEstimado
            };

            await _servicoService.AtualizarServicoAsync(id, servico);

            return Ok(servico);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            return Ok(
                await _servicoService.DeletarServicoAsync(id)
            );
        }
    }
}