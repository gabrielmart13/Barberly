using Barberly.API.Data;
using Barberly.API.Models;
using Microsoft.AspNetCore.Mvc;

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
        public ActionResult <List<Avaliacao>> Get()
        {
            return new List<Avaliacao>();
        }

        [HttpGet("{id}")]
        public ActionResult <Avaliacao> Get(int id)
        {
            return new Avaliacao();
        }

        [HttpPost]
        public ActionResult <Avaliacao> Post(Avaliacao avaliacao)
        {
            return new Avaliacao();
        }

        [HttpPut("{id}")]
        public ActionResult <Avaliacao> Put(int id, Avaliacao avaliacao)
        {
            return new Avaliacao();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            return NoContent();
        }


        
    }
}
