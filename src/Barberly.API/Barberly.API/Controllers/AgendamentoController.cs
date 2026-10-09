using Barberly.API.Data;
using Barberly.API.Domain.DTOs.AgendamentoDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AgendamentoController : ControllerBase
    {
        private readonly IAgendamentoService _agendamentoService;
        public AgendamentoController(IAgendamentoService agendamentoService)
        {
            _agendamentoService = agendamentoService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Agendamento>>> Get()
        {
            var agendamentos = await _agendamentoService.PegarAgendamentosAsync();
            return Ok(agendamentos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Agendamento>> Get(int id)
        {
            var agendamento = await _agendamentoService.PegarAgendamentoAsync(id);

            return Ok(agendamento);
        }

        [HttpPost]
        public async Task<ActionResult<Agendamento>> Post(CriarAgendamentoRequest request)
        {
            Agendamento agendamento = new Agendamento
            {
                DataHora = request.DataHora,
                IdUsuario = request.IdUsuario,
                IdBarbearia = request.IdBarbearia,
                IdBarbeiro = request.IdBarbeiro,
                IdServico = request.IdServico
            };
            await _agendamentoService.CriarAgendamentoAsync(agendamento);
            return Ok(agendamento);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await _agendamentoService.DeletarAgendamentoAsync(id));
        }
    }
}