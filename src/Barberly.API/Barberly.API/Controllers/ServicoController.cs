using Barberly.API.Domain.DTOs.ServicoDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
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

        // Consulta pública de todos os serviços.
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<List<Servico>>> Get()
        {
            var servicos = await _servicoService.PegarTodosServicosAsync();
            return Ok(servicos);
        }

        // Consulta pública de um serviço específico.
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<Servico>> Get(int id)
        {
            var servico = await _servicoService.PegarServicoAsync(id);
            return Ok(servico);
        }

        // Somente donos autenticados podem cadastrar serviços.
        [Authorize(Roles = "DonoBarbearia")]
        [HttpPost]
        public async Task<ActionResult<Servico>> Post(CriarServicoRequest request)
        {
            var servico = await _servicoService.CriarServicoAsync(request);
            return Ok(servico);
        }

        // Somente donos autenticados podem atualizar serviços.
        [Authorize(Roles = "DonoBarbearia")]
        [HttpPut("{id}")]
        public async Task<ActionResult<Servico>> Put(int id, AtualizarServicoRequest request)
        {
            var servico = await _servicoService.AtualizarServicoAsync(id, request);
            return Ok(servico);
        }

        // Somente donos autenticados podem excluir serviços.
        [Authorize(Roles = "DonoBarbearia")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await _servicoService.DeletarServicoAsync(id));
        }
    }
}