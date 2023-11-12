package services

import (
	"context"
	"io"
	"log"
	"os"
	"os/exec"

	"github.com/joao-macieira/video-encoder/application/repositories"
	"github.com/joao-macieira/video-encoder/domain"

	"cloud.google.com/go/storage"
)

type VideoService struct {
	Video           *domain.Video
	VideoRepository repositories.VideoRepository
}

func NewVideoService() VideoService {
	return VideoService{}
}

func (videoService *VideoService) Download(bucketName string) error {
	ctx := context.Background()

	client, err := storage.NewClient(ctx)

	if err != nil {
		return err
	}

	bucket := client.Bucket(bucketName)

	object := bucket.Object(videoService.Video.FilePath)

	reader, err := object.NewReader(ctx)

	if err != nil {
		return err
	}

	defer reader.Close()

	body, err := io.ReadAll(reader)

	if err != nil {
		return err
	}

	file, err := os.Create(os.Getenv("LOCAL_STORAGE_PATH") + "/" + videoService.Video.ID + ".mp4")

	if err != nil {
		return err
	}

	_, err = file.Write(body)

	if err != nil {
		return err
	}

	defer file.Close()

	log.Printf("video %v has been stored", videoService.Video.ID)

	return nil
}

func (videoService *VideoService) Fragment() error {
	err := os.Mkdir(os.Getenv("LOCAL_STORAGE_PATH")+"/"+videoService.Video.ID, os.ModePerm)

	if err != nil {
		return err
	}

	source := os.Getenv("LOCAL_STORAGE_PATH") + "/" + videoService.Video.ID + ".mp4"
	target := os.Getenv("LOCAL_STORAGE_PATH") + "/" + videoService.Video.ID + ".frag"

	command := exec.Command("mp4fragment", source, target)

	output, err := command.CombinedOutput()

	if err != nil {
		return err
	}

	printOutput(output)

	return nil
}

func (videoService *VideoService) Encode() error {
	cmdArgs := []string{}
	cmdArgs = append(cmdArgs, os.Getenv("LOCAL_STORAGE_PATH")+"/"+videoService.Video.ID+".frag")
	cmdArgs = append(cmdArgs, "--use-segment-timeline")
	cmdArgs = append(cmdArgs, "-o")
	cmdArgs = append(cmdArgs, os.Getenv("LOCAL_STORAGE_PATH")+"/"+videoService.Video.ID)
	cmdArgs = append(cmdArgs, "-f")
	cmdArgs = append(cmdArgs, "--exec-dir")
	cmdArgs = append(cmdArgs, "/opt/bento4/bin/")
	cmd := exec.Command("mp4dash", cmdArgs...)

	output, err := cmd.CombinedOutput()

	if err != nil {
		return err
	}

	printOutput(output)

	return nil
}

func (videoService *VideoService) Finish() error {

	err := os.Remove(os.Getenv("LOCAL_STORAGE_PATH") + "/" + videoService.Video.ID + ".mp4")

	if err != nil {
		log.Println("error removing mp4 ", videoService.Video.ID, ".mp4")
		return err
	}

	err = os.Remove(os.Getenv("LOCAL_STORAGE_PATH") + "/" + videoService.Video.ID + ".frag")

	if err != nil {
		log.Println("error removing frag ", videoService.Video.ID, ".frag")
		return err
	}

	err = os.RemoveAll(os.Getenv("LOCAL_STORAGE_PATH") + "/" + videoService.Video.ID)

	if err != nil {
		log.Println("error removing mp4 ", videoService.Video.ID, ".mp4")
		return err
	}

	log.Println("files have been removed: ", videoService.Video.ID)

	return nil
}

func (videoService *VideoService) InsertVideo() error {
	_, err := videoService.VideoRepository.Insert(videoService.Video)

	if err != nil {
		return err
	}

	return nil
}

func printOutput(output []byte) {
	if len(output) > 0 {
		log.Printf("=====> Output: %s\n", string(output))
	}
}
