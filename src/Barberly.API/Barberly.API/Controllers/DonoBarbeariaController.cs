using Barberly.API.Domain.DTOs.DonoBarbeariaDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DonoBarbeariaController : ControllerBase
    {
        private readonly IDonoBarbeariaService _donobarbeariaService;

        public DonoBarbeariaController(
            IDonoBarbeariaService donobarbeariaService)
        {
            _donobarbeariaService = donobarbeariaService;
        }

        // Somente donos autenticados podem consultar donos.
        [Authorize(Roles = "DonoBarbearia")]
        [HttpGet("{id}")]
        public async Task<ActionResult<DonoBarbearia>> Get(int id)
        {
            var donobarbearia = await _donobarbeariaService.PegarDonoBarbeariaAsync(id);

            return Ok(donobarbearia);
        }

        // Somente donos autenticados podem atualizar dados.
        [Authorize(Roles = "DonoBarbearia")]
        [HttpPut("{id}")]
        public async Task<ActionResult<DonoBarbearia>> Put(
            int id,
            AtualizarDonoBarbeariaRequest request)
        {
            var donobarbearia = await _donobarbeariaService.AtualizarDonoBarbeariaAsync(id, request);

            return Ok(donobarbearia);
        }

        // Somente donos autenticados podem excluir contas.
        [Authorize(Roles = "DonoBarbearia")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(
                await _donobarbeariaService.DeletarDonoBarbeariaAsync(id)
            );
        }
    }
}