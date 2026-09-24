using Barberly.API.Data;
using Barberly.API.Models;
using Microsoft.AspNetCore.Mvc;

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
        public ActionResult<List<HorarioFuncionamento>> Get()
        {
            return new List<HorarioFuncionamento>();
        }

        [HttpGet("{id}")]
        public ActionResult<HorarioFuncionamento> Get(int id)
        {
            return new HorarioFuncionamento();
        }

        [HttpPost]
        public ActionResult<HorarioFuncionamento> Post(HorarioFuncionamento horariofuncionamento)
        {
            return new HorarioFuncionamento();
        }

        [HttpPut("{id}")]
        public ActionResult<HorarioFuncionamento> Put(int id, HorarioFuncionamento horariofuncionamento)
        {
            return new HorarioFuncionamento();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            return NoContent();
        }
    }
}
