using Barberly.API.Domain.DTOs.AgendamentoDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<List<Agendamento>>> Get()
        {
            var agendamentos = await _agendamentoService.PegarAgendamentosAsync();
            return Ok(agendamentos);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<Agendamento>> Get(int id)
        {
            var agendamento = await _agendamentoService.PegarAgendamentoAsync(id);
            return Ok(agendamento);
        }

        [Authorize(Roles = "Usuario")]
        [HttpPost]
        public async Task<ActionResult<Agendamento>> Post(CriarAgendamentoRequest request)
        {
            var agendamento = await _agendamentoService.CriarAgendamentoAsync(request);
            return Ok(agendamento);
        }

        [Authorize(Roles = "Usuario, DonoBarbearia")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await _agendamentoService.DeletarAgendamentoAsync(id));
        }
    }
}