import logging
from pathlib import Path
from utils import ConfigManager

config = ConfigManager()
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', datefmt='%d-%b-%y %H:%M:%S')

def createLogger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)
    file_hndlr = logging.FileHandler(Path(config.LOG_PATH) / f'{name}_log.log')
    file_hndlr.setLevel(logging.DEBUG)
    file_hndlr.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s', datefmt='%d-%b-%y %H:%M:%S'))
    logger.addHandler(file_hndlr)
    return logger

def getLogger(name: str) -> logging.Logger:
    return logging.getLogger(name)

def info_log(logger: logging.Logger, msg: str) -> None:
    logger.info(msg)

def debug_log(logger: logging.Logger, msg: str) -> None:
    logger.debug(msg)

def error_log(logger: logging.Logger, msg: str) -> None:
    logger.error(msg)

def warning_log(logger: logging.Logger, msg: str) -> None:
    logger.warning(msg)