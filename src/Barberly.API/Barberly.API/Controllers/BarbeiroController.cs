using Barberly.API.Domain.DTOs.BarbeiroDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BarbeiroController : ControllerBase
    {
        private readonly IBarbeiroService _barbeiroService;
        public BarbeiroController (IBarbeiroService barbeiroService)
        {
            _barbeiroService = barbeiroService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<List<Barbeiro>>> Get()
        {
            var barbeiros = await _barbeiroService.PegarTodosBarbeirosAsync();
            return Ok(barbeiros);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<Barbeiro>> Get(int id)
        {
            var barbeiro = await _barbeiroService.PegarBarbeiroAsync(id);

            return Ok(barbeiro);
        }

        [Authorize(Roles = "DonoBarbearia")]
        [HttpPost]
        public async Task<ActionResult<Barbeiro>> Post(CriarBarbeiroRequest request)
        {
            var barbeiro = await _barbeiroService.CriarBarbeiroAsync(request);
            return Ok(barbeiro);
        }

        [Authorize(Roles = "DonoBarbearia")]
        [HttpPut("{id}")]
        public async Task<ActionResult<Barbeiro>> Put(int id, AtualizarBarbeiroRequest request)
        {
            var barbeiro = await _barbeiroService.AtualizarBarbeiroAsync(id, request);
            return Ok(barbeiro);
        }

        [Authorize(Roles = "DonoBarbearia")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await _barbeiroService.DeletarBarbeiroAsync(id));
        }
    }
}
